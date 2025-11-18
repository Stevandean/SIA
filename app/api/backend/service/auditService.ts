import prisma from "@/lib/prisma"

// Tipe aksi audit untuk konsistensi
type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "VIEW"

// Fungsi untuk mencatat audit trail
export async function createAuditTrail(
  userId: string,
  action: AuditAction,
  entity: string,
  entityId: string | number,
  description: string
): Promise<void> {
  try {
    await prisma.auditTrail.create({
      data: {
        userId,
        action,
        entity,
        entityId: String(entityId),
        description,
      },
    })
  } catch (error) {
    console.error("❌ Failed to create audit trail:", error)
  }
}

// Fungsi untuk mengambil data audit trail (misalnya untuk halaman admin)
export async function getAuditTrail(limit = 100) {
  try {
    const auditTrail = await prisma.auditTrail.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return auditTrail
  } catch (error) {
    console.error("❌ Failed to fetch audit trail:", error)
    throw new Error("Gagal mengambil data audit trail")
  }
}
