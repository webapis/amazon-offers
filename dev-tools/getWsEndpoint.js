const axios = require('axios');
module.exports = async function () {
  try {
    const response = await axios.get('http://localhost:3000/wsendpoint');

    return response.data;
  } catch (error) {
    throw error;
  }
};
