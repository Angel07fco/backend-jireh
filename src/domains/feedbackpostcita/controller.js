const FeedbackPostCita = require("./model");

const sendFeedbackPostcita = async (data) => {
  try {
    const { userId, citaId, pregunta1, pregunta2, pregunta3, comentarios } =
      data;

    const newFeedbackPostCita = new FeedbackPostCita({
      userId,
      citaId,
      pregunta1,
      pregunta2,
      pregunta3,
      comentarios,
    });
    const createdFeedbackPostCita = await newFeedbackPostCita.save();
    return createdFeedbackPostCita;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { sendFeedbackPostcita };
