const encoder = new TextEncoder()
const PBKDF2_ITERATIONS = 120000

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function bytesToBase64(bytes) {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return window.btoa(binary)
}

export function generateSalt() {
  const bytes = new Uint8Array(16)

  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes)
    return bytesToBase64(bytes)
  }

  const fallbackValue = `${Date.now()}-${Math.random()}`
  return window.btoa(fallbackValue).slice(0, 24)
}

export async function hashPassword(password, salt) {
  if (window.crypto?.subtle) {
    try {
      const key = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits'],
      )

      const derivedBits = await window.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: encoder.encode(salt),
          iterations: PBKDF2_ITERATIONS,
          hash: 'SHA-256',
        },
        key,
        256,
      )

      return {
        hash: bytesToHex(new Uint8Array(derivedBits)),
        algorithm: `PBKDF2-SHA-256 (${PBKDF2_ITERATIONS} iterations)`,
        fallback: false,
      }
    } catch {
      const digest = await window.crypto.subtle.digest(
        'SHA-256',
        encoder.encode(`${salt}:${password}`),
      )

      return {
        hash: bytesToHex(new Uint8Array(digest)),
        algorithm: 'SHA-256 demo fallback with salt',
        fallback: true,
      }
    }
  }

  return {
    hash: window.btoa(`${salt}:${password.length}:${Date.now()}`),
    algorithm: 'Demo fallback - Web Crypto unavailable',
    fallback: true,
  }
}

export async function createPasswordRecord(password) {
  const salt = generateSalt()
  const { hash, algorithm, fallback } = await hashPassword(password, salt)

  return {
    passwordHash: hash,
    salt,
    hashAlgorithm: algorithm,
    hashFallback: fallback,
  }
}

export function maskHash(hash = '') {
  if (!hash) return 'Not generated'
  if (hash.length <= 18) return hash
  return `${hash.slice(0, 12)}...${hash.slice(-6)}`
}

export async function generateDemoPasswordHashIfNeeded(user) {
  if (user.passwordHash && user.salt && user.hashAlgorithm) return user

  const record = await createPasswordRecord(`${user.email}:educational-demo-record`)
  return {
    ...user,
    ...record,
  }
}
