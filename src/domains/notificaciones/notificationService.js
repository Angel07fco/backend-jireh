const webpush = require("web-push");
const Notification = require("./model");
const { AUTH_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;

webpush.setVapidDetails(
  `mailto:${AUTH_EMAIL}`,
  VAPID_PUBLIC_KEY, // clave pública generada
  VAPID_PRIVATE_KEY // clave privada generada
);

const sendNotificationService = async ({ title, body, url }) => {
  try {
    // Definir el payload de la notificación
    const payload = JSON.stringify({ title, body, url });

    // Obtener todas las suscripciones
    const subscriptions = await Notification.find();

    // Enviar la notificación a todas las suscripciones
    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        // Enviar la notificación
        await webpush.sendNotification(subscription, payload);
      } catch (error) {
        console.error("Error al enviar notificación:", error);

        // Si la suscripción no es válida (error 410), la eliminamos
        if (error.statusCode === 410) {
          await Notification.deleteOne({ _id: subscription._id });
        }
      }
    });

    // Esperar a que se envíen todas las notificaciones
    await Promise.all(sendPromises);

    return { message: "Notificación enviada correctamente" };
  } catch (error) {
    console.error("Error al enviar la notificación:", error);
    throw new Error("Error al enviar la notificación");
  }
};

module.exports = {
  sendNotificationService,
};
