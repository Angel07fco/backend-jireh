const FeedbackPostAgendamiento = require("./model");

const sendFeedbackPostAgendamiento = async (data) => {
  try {
    const { userId, citaId, pregunta1, pregunta2, pregunta3, comentarios } =
      data;

    const newFeedbackPostAgendamiento = new FeedbackPostAgendamiento({
      userId,
      citaId,
      pregunta1,
      pregunta2,
      pregunta3,
      comentarios,
    });
    const createdFeedbackPostAgendamiento =
      await newFeedbackPostAgendamiento.save();
    return createdFeedbackPostAgendamiento;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { sendFeedbackPostAgendamiento };
