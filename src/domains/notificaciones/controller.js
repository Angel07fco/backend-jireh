const Notification = require("./model");
const { sendNotificationService } = require("./notificationService");

const saveSubscription = async (subscription) => {
  try {
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      throw new Error("Datos de suscripción incompletos");
    }

    // Verificamos si la suscripción ya existe
    const existingSubscription = await Notification.findOne({
      endpoint: subscription.endpoint,
    });

    // Si no existe, guardamos la nueva suscripción
    if (!existingSubscription) {
      const newSubscription = new Notification({
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      });
      await newSubscription.save();
      return "Suscripción guardada correctamente";
    }

    // Si la suscripción ya existe
    return "La suscripción ya está registrada";
  } catch (error) {
    throw new Error("Error al guardar la suscripción: " + error.message);
  }
};

const sendNotificationController = async (req, res) => {
  const { title, body, url } = req.body;

  try {
    // Llamamos al servicio para enviar la notificación
    const result = await sendNotificationService({ title, body, url });
    res.status(200).json({
      success: true,
      message: "Notificación enviada con éxito.",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  saveSubscription,
  sendNotificationController,
};
