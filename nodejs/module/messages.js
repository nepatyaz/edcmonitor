const pesan = {
  gagalfetch: {
    message: "Gagal Fetch Data ",
    status: "error"
  },
  notAuthorized: {
    message: "Not Authorized",
    status: "error"
  },
  declinedToken: {
    message: "Token Declined",
    status: "error"
  },
  deleteSucces: {
    deleteStatus: true,
    message: "Deleted",
    status: "ok"
  },
  deleteError: {
    deleteStatus: false,
    message: "Delete Gagal",
    status: "error"
  },
  uploadError: {
    uploadStatus : false, 
    message: "Upload Gagal",
    status: "error"
  },
  updatePicGagal: {
    uploadStatus : false,
    message: "Update Profile Pic Gagal",
    status: "error"
  },
  registerSucces:{
    message : "Register User Sukses",
    status : "ok"
  },
  registerGagal:{
    registerStatus : false,
    message : "Register User Gagal",
    status : "error"
  },
  enableSucces:{
    message : "Enable Success",
    status : "ok"
  },
  enableGagal:{
    enableStatus : false,
    message : "Enable Gagal",
    status : "error"
  },
}
module.exports = pesan;
