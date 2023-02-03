import nodemailer from "nodemailer";

export const emailRegistro = async(datos) => {

    const { email , nombre , token } = datos;

    //TODO: Mover hacia variables de entorno
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "d08c6f4915c453",
          pass: "19b41cde18fb06"
        }
    });

    //Información del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Reestablece tu Password",
        text: "",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:

        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        
        `
    })

};

export const emailOlvidePassword = async(datos) => {

    const { email , nombre , token } = datos;

    //TODO: Mover hacia variables de entorno
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "d08c6f4915c453",
          pass: "19b41cde18fb06"
        }
    });

    //Información del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Reestablece tu Password",
        text: "Comprueba tu cuenta en UpTask",
        html: `<p>Hola: ${nombre} Has solicitado reestablecer tu password</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:

        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>

        <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
        
        `
    })

};