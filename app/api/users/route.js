import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route' // path ke konfigurasi NextAuth kamu

// 🧱 Middleware kecil untuk validasi role admin
async function checkAdmin() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return session.user
}

/* ==========================
   ✅ CREATE USER (POST)
   ========================== */
export async function POST(req) {
  const user = await checkAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Akses ditolak: hanya admin yang dapat menambah user' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah digunakan' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'KASIR',
      },
    })

    return NextResponse.json({ message: 'User berhasil dibuat', user: newUser }, { status: 201 })
  } catch (error) {
    console.error('❌ CREATE USER ERROR:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}

/* ==========================
   ✅ READ USERS (GET)
   ========================== */
export async function GET() {
  const user = await checkAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Akses ditolak: hanya admin yang dapat melihat daftar user' }, { status: 403 })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('❌ GET USERS ERROR:', error)
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 })
  }
}

/* ==========================
   ✅ UPDATE USER (PUT)
   ========================== */
export async function PUT(req) {
  const user = await checkAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Akses ditolak: hanya admin yang dapat mengedit user' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { id, name, email, password, role } = body

    if (!id) {
      return NextResponse.json({ error: 'ID user wajib diisi' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { id } })
    if (!existingUser) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    let updateData = { name, email, role }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ message: 'User berhasil diperbarui', user: updatedUser })
  } catch (error) {
    console.error('❌ UPDATE USER ERROR:', error)
    return NextResponse.json({ error: 'Gagal memperbarui user' }, { status: 500 })
  }
}

/* ==========================
   ✅ DELETE USER (DELETE)
   ========================== */
export async function DELETE(req) {
  const user = await checkAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Akses ditolak: hanya admin yang dapat menghapus user' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID user wajib disertakan' }, { status: 400 })
    }

    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ message: 'User berhasil dihapus' })
  } catch (error) {
    console.error('❌ DELETE USER ERROR:', error)
    return NextResponse.json({ error: 'Gagal menghapus user' }, { status: 500 })
  }
}
