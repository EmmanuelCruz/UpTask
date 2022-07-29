import nodemailer from 'nodemailer';

export const emailRegistro = async datos => {
  const {email, nombre, token} = datos

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const info = await transport.sendMail({
    from: 'UpTask Administrador de proyectos',
    to: email,
    subject: 'UpTask - Confirma tu cuenta',
    text: 'Confirma tu cuenta en UpTask',
    html: `
      <p>Hola ${nombre}, comprueba tu cuenta en UpTask</p>
      <p>Tu cuenta ya está casi lista. Compruebala en el siguiente enlace:
        <a href='${process.env.BACKEND}/confirmar/${token}'>Comprobar cuenta</a>
      </p>
      <p>Si no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
  })
}

export const emailOlvidePassword = async datos => {
  const {email, nombre, token} = datos

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const info = await transport.sendMail({
    from: 'UpTask Administrador de proyectos',
    to: email,
    subject: 'UpTask - Restablece tu password',
    text: 'Restablece tu en UpTask',
    html: `
      <p>Hola ${nombre}, has solicitado reestablecer tu password en UpTask</p>
      <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href='${process.env.BACKEND}/olvide-password/${token}'>Reestablecer password</a>
      </p>
      <p>Si no solicitaste cambio de password, puedes ignorar el mensaje</p>
    `
  })
}