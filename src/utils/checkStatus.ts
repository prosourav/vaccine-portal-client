export const getStatusValue = (status: string) => {
  if (status === 'approved')
   { console.log("green called!"); return 'text-green-500';}
  if (status === 'pending')
   { console.log("blue called!"); return 'text-blue-500';}
  if (status === 'blocked')
  {  console.log("red called!");  return 'text-red-500';}

};