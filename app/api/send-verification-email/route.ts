import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

/**
 * API Route untuk mengirim email verifikasi
 *
 * Mengirim email verifikasi ke pengguna yang baru mendaftar
 */
export async function POST(request: Request) {
  try {
    // Ambil data dari request
    const { email, verificationLink } = await request.json()

    // Validasi input
    if (!email || !verificationLink) {
      return NextResponse.json({ error: "Email dan link verifikasi diperlukan" }, { status: 400 })
    }

    // Buat transporter nodemailer
    const transporter = nodemailer.createTransport({
      secure: true,
      service: "gmail",
      auth: {
        user: "fadhil8637@smk.belajar.id",
        pass: "fedw woyz tyhs nlxd",
      },
    })

    // Konten email
    const mailOptions = {
      from: "fadhil8637@smk.belajar.id",
      to: email,
      subject: "Verifikasi Email Anda untuk Dashboard Ecommerce",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4338ca;">Verifikasi Alamat Email Anda</h2>
          <p>Terima kasih telah mendaftar di Dashboard Ecommerce kami. Silakan verifikasi alamat email Anda untuk menyelesaikan pendaftaran.</p>
          <div style="margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #4338ca; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verifikasi Alamat Email</a>
          </div>
          <p>Jika Anda tidak membuat akun, Anda dapat mengabaikan email ini.</p>
          <p>Link ini akan kedaluwarsa dalam 24 jam.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">Jika tombol tidak berfungsi, salin dan tempel link ini ke browser Anda: ${verificationLink}</p>
        </div>
      `,
    }

    // Kirim email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending verification email:", error)
    return NextResponse.json({ error: "Gagal mengirim email verifikasi" }, { status: 500 })
  }
}

