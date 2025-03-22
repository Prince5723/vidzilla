import {app} from "./app.js"
import  config  from "./src/utils/config.js";
import { connectdb } from "./src/dbconnection/dbindex.js";


connectdb()
.then(()=>{
  app.listen(3000, () => {
    console.log("Your application is running on port 3000");
  })
})
.catch((err) =>{
  console.log(`not connected mongodb`)
})
