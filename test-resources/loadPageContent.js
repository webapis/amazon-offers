const fs = require('fs');
const path =require('path')
module.exports = async function ({filepath}) {
  try {
    
    const content = fs.readFileSync(path.join(__dirname,filepath), 'utf8')
  
    return content
  } catch (error) {
    debugger;
    throw error;
  }
};
