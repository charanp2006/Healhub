import mongoose from "mongoose";

declare global {
   
  var mongooseGlobal:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const RAW_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "healhub";

// `mongodb+srv://` URIs depend on SRV DNS records, which some local/VPN DNS
// resolvers refuse (ECONNREFUSED on `querySrv`). To keep the driver independent
// of the system resolver we resolve SRV + TXT via DNS-over-HTTPS and build a
// plain `mongodb://` connection URI.
const DOH_URL = "https://cloudflare-dns.com/dns-query";

interface DoHAnswer {
  name: string;
  type: number;
  data?: string;
}

async function dohQuery(type: "SRV" | "TXT", name: string): Promise<string[]> {
  const res = await fetch(`${DOH_URL}?name=${encodeURIComponent(name)}&type=${type}`, {
    headers: { accept: "application/dns-json" },
  });
  if (!res.ok) throw new Error(`DNS-over-HTTPS ${type} lookup failed: ${res.status}`);
  const json = (await res.json()) as { Answer?: DoHAnswer[] };
  return (json.Answer ?? []).flatMap((a) =>
    a.data ? [a.data.replace(/^"|"$/g, "")] : []
  );
}

// `mongodb+srv://` URIs depend on SRV DNS records, which some resolvers refuse.
// To keep the driver independent of SRV resolution, we pre-resolve the shard
// hosts + TXT options ourselves and build a plain `mongodb://` connection URI.
let resolvedURI: string | null = null;
async function resolveMongoURI(): Promise<string> {
  if (!RAW_URI.startsWith("mongodb+srv://")) return `${RAW_URI}/${DB_NAME}`;

  try {
    const baseHost = RAW_URI.split("://")[1].split("/")[0];
    const userInfo = RAW_URI.split("://")[1].split("@")[0];

    const [srvAnswers, txtAnswers] = await Promise.all([
      dohQuery("SRV", `_mongodb._tcp.${baseHost}`),
      dohQuery("TXT", baseHost),
    ]);

    // SRV data format: "<priority> <weight> <port> <target>"
    const hosts = srvAnswers.map((data) => {
      const parts = data.trim().split(/\s+/);
      return `${parts[3]}:${parts[2]}`;
    }).join(",");

    const txtOpts = txtAnswers.join("&");
    const query = ["ssl=true", txtOpts, "retryWrites=true", "w=majority"]
      .filter(Boolean)
      .join("&");

    return `mongodb://${userInfo}@${hosts}/${DB_NAME}?${query}`;
  } catch {
    // If SRV cannot be resolved, fall back to the original URI and let the
    // driver surface the native error.
    return RAW_URI;
  }
}

const cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } =
  globalThis.mongooseGlobal ?? (globalThis.mongooseGlobal = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = resolvedURI ?? (resolvedURI = await resolveMongoURI());
    cached.promise = mongoose.connect(uri).then((instance) => instance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
