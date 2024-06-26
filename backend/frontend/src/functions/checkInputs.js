export async function checkinputs(email ,name ,password ,toast){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!email||!name||!password){
     toast.warning("Please enter all fields");
     return;
    }
     if(await !regex.test(email)){
      toast.error("invalid email format");
      return;
     }
     return true;
}

export function checkLogin(email  ,password ,toast){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!email||!password){
     toast.warning("Please enter all fields");
     return;
    }
     if(!regex.test(email)){
      toast.error("invalid email format");
      return;
     }
     return true;
}