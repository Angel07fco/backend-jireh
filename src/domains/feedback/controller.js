const Feedback = require("./model");

const sendFeedbackPostAgendamiento = async (data) => {
  try {
    const { userId, citaId, dispositivo, pregunta1, pregunta2, pregunta3 } =
      data;

    const newFeedbackPostAgendamiento = new Feedback({
      userId,
      citaId,
      dispositivo,
      pregunta1,
      pregunta2,
      pregunta3,
    });
    const createdFeedbackPostAgendamiento =
      await newFeedbackPostAgendamiento.save();
    return createdFeedbackPostAgendamiento;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPregunta1StatsWeb = async () => {
  try {
    const stats = await Feedback.aggregate([
      {
        $match: { dispositivo: "web" },
      },
      {
        $group: {
          _id: "$pregunta1",
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          title: "$_id",
          votes: "$total",
          color: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "bg-indigo-500" },
                { case: { $eq: ["$_id", 2] }, then: "bg-fuchsia-500" },
                { case: { $eq: ["$_id", 3] }, then: "bg-violet-500" },
              ],
              default: "bg-gray-500",
            },
          },
        },
      },
    ]);

    const formattedStats = [1, 2, 3].map((title) => {
      const stat = stats.find((s) => s.title === title);

      // Mapeo de títulos numéricos a textos
      let label = "";
      if (title === 1) label = "Fácil";
      if (title === 2) label = "Regular";
      if (title === 3) label = "Difícil";

      return {
        title: label, // Asignamos el título textual
        votes: stat ? stat.votes : 0,
        color: stat ? stat.color : "bg-gray-500",
      };
    });

    return formattedStats;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPregunta2StatsWeb = async () => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { dispositivo: "web" } },
      { $group: { _id: "$pregunta2", total: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          title: "$_id",
          votes: "$total",
          color: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "bg-indigo-500" },
                { case: { $eq: ["$_id", 2] }, then: "bg-fuchsia-500" },
              ],
              default: "bg-gray-500",
            },
          },
        },
      },
    ]);

    const formattedStats = [1, 2].map((title) => {
      const stat = stats.find((s) => s.title === title);
      let label = "";
      if (title === 1) label = "Sí";
      if (title === 2) label = "No";

      return {
        title: label,
        votes: stat ? stat.votes : 0,
        color: stat ? stat.color : "bg-gray-500",
      };
    });

    return formattedStats;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPregunta3StatsWeb = async () => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { dispositivo: "web" } },
      { $group: { _id: "$pregunta3", total: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          title: "$_id",
          votes: "$total",
          color: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "bg-indigo-500" },
                { case: { $eq: ["$_id", 2] }, then: "bg-fuchsia-500" },
                { case: { $eq: ["$_id", 3] }, then: "bg-violet-500" },
              ],
              default: "bg-gray-500",
            },
          },
        },
      },
    ]);

    const formattedStats = [1, 2, 3].map((title) => {
      const stat = stats.find((s) => s.title === title);
      let label = "";
      if (title === 1) label = "Buena";
      if (title === 2) label = "Neutral";
      if (title === 3) label = "Mala";

      return {
        title: label,
        votes: stat ? stat.votes : 0,
        color: stat ? stat.color : "bg-gray-500",
      };
    });

    return formattedStats;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPregunta1StatsMovil = async () => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { dispositivo: "movil" } },
      { $group: { _id: "$pregunta1", total: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          title: "$_id",
          votes: "$total",
          color: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "bg-indigo-500" },
                { case: { $eq: ["$_id", 2] }, then: "bg-fuchsia-500" },
                { case: { $eq: ["$_id", 3] }, then: "bg-violet-500" },
              ],
              default: "bg-gray-500",
            },
          },
        },
      },
    ]);

    const formattedStats = [1, 2, 3].map((title) => {
      const stat = stats.find((s) => s.title === title);
      let label = "";
      if (title === 1) label = "Fácil";
      if (title === 2) label = "Regular";
      if (title === 3) label = "Difícil";

      return {
        title: label, // Asignamos el título textual
        votes: stat ? stat.votes : 0,
        color: stat ? stat.color : "bg-gray-500",
      };
    });

    return formattedStats;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPregunta2StatsMovil = async () => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { dispositivo: "movil" } },
      { $group: { _id: "$pregunta2", total: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          title: "$_id",
          votes: "$total",
          color: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "bg-indigo-500" },
                { case: { $eq: ["$_id", 2] }, then: "bg-fuchsia-500" },
              ],
              default: "bg-gray-500",
            },
          },
        },
      },
    ]);

    const formattedStats = [1, 2].map((title) => {
      const stat = stats.find((s) => s.title === title);
      let label = "";
      if (title === 1) label = "Sí";
      if (title === 2) label = "No";

      return {
        title: label,
        votes: stat ? stat.votes : 0,
        color: stat ? stat.color : "bg-gray-500",
      };
    });

    return formattedStats;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPregunta3StatsMovil = async () => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { dispositivo: "movil" } },
      { $group: { _id: "$pregunta3", total: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          title: "$_id",
          votes: "$total",
          color: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "bg-indigo-500" },
                { case: { $eq: ["$_id", 2] }, then: "bg-fuchsia-500" },
                { case: { $eq: ["$_id", 3] }, then: "bg-violet-500" },
              ],
              default: "bg-gray-500",
            },
          },
        },
      },
    ]);

    const formattedStats = [1, 2, 3].map((title) => {
      const stat = stats.find((s) => s.title === title);
      let label = "";
      if (title === 1) label = "Buena";
      if (title === 2) label = "Neutral";
      if (title === 3) label = "Mala";

      return {
        title: label,
        votes: stat ? stat.votes : 0,
        color: stat ? stat.color : "bg-gray-500",
      };
    });

    return formattedStats;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  sendFeedbackPostAgendamiento,
  getPregunta1StatsWeb,
  getPregunta2StatsWeb,
  getPregunta3StatsWeb,
  getPregunta1StatsMovil,
  getPregunta2StatsMovil,
  getPregunta3StatsMovil,
};
