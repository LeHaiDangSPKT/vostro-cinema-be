const UserModel = require("../models/User");
const BillModel = require("../models/Bill");
const FeedbackModel = require("../models/Feedback");
const nodemailer = require("nodemailer");

class User {
  // [POST] /user/signIn
  signIn(req, res, next) {
    if (req.body.state) {
      UserModel.findOne(
        {
          $or: [
            { username: req.body.username },
            { phoneNumber: req.body.phoneNumber },
            { email: req.body.email },
          ],
        },
        (err, result) => {
          if (result) {
            if (req.body.username == result.username) {
              res.status(404).send("Tên tài khoản đã tồn tại");
            } else if (req.body.phoneNumber == result.phoneNumber) {
              res.status(404).send("Số điện thoại đã tồn tại");
            } else {
              res.status(404).send("Email đã tồn tại");
            }
          } else {
            const options = {
              from: `VOSTRO CINEMA <${process.env.USER}>`,
              to: req.body.email,
              subject: "Code Verify",
              html: `
                  <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
                  <div style="max-width: 700px; background-color: white; margin: 0 auto">
                      <div style="width: 100%; background-color: #00efbc; padding: 20px 0; text-align: center;">
                          <h3 style="font-size: 1.5rem">VOSTRO CINEMA</h3>
                      </div>
                      <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
                    
                          <div style="font-size: 1.2rem; margin: 0 30px; text-align: center;">
                              <p>Mã OTP của bạn là: <span style="font-weight: 700;">${req.body.otp}</span></p>
                          </div>
                      </div>
                  </div>
                      `,
            };
            let transpoter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                user: process.env.USER, // email
                pass: process.env.PASSWORD, //password
              },
            });
            transpoter.sendMail(options).then((result) => res.json(result));
          }
        }
      );
    } else {
      UserModel.findOne({}, (err, result) => {
        if (err) {
          res.status(404).send("Lỗi hệ thống!!!");
        } else {
          const user = req.body;
          const newUser = new UserModel(user);
          newUser.save();
          res.json(user);
        }
      });
    }
  }
  // [POST] /user/logIn
  logIn(req, res, next) {
    UserModel.findOne(
      {
        $and: [
          { username: req.body.username },
          { password: req.body.password },
          { state: true },
        ],
      },
      (err, result) => {
        if (result) {
          res.json(result);
        } else {
          res.status(404).send("Tên tài khoản hoặc mật khẩu không đúng");
          //Không chia trường hợp vì tính bảo mật
        }
      }
    );
  }

  // [POST] /user/resetPassword
  resetPassword(req, res, next) {
    UserModel.findOne({ email: req.body.email }, (err, result) => {
      if (result) {
        const options = {
          from: `VOSTRO CINEMA <${process.env.USER}>`,
          to: req.body.email,
          subject: "Code Verify",
          html: `
                <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
                <div style="max-width: 700px; background-color: white; margin: 0 auto">
                    <div style="width: 100%; background-color: #00efbc; padding: 20px 0; text-align: center;">
                        <h3 style="font-size: 1.5rem">VOSTRO CINEMA</h3>
                    </div>
                    <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">

                        <div style="font-size: 1.2rem; margin: 0 30px; text-align: center;">
                        ${
                          req.body.state === "getOTP"
                            ? `<p>Mã OTP của bạn là: <span style="font-weight: 700;">${req.body.otp}</span></p>`
                            : `<p>Mật khẩu của bạn là: <span style="font-weight: 700;">${result.password}</span></p>`
                        }
                        </div>
                    </div>
                </div>
                    `,
        };
        let transpoter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.USER, // email
            pass: process.env.PASSWORD, //password
          },
        });
        transpoter.sendMail(options).then((result) => res.json(result));
      } else {
        res.status(404).send("Email không tồn tại trong hệ thống");
      }
    });
  }

  //[POST] /user/provisionalInvoice
  provisionalInvoice(req, res, next) {
    const bill = req.body;
    const newBill = new BillModel(bill);
    newBill.save();
    res.json(bill);
  }

  //[GET] /user/:id
  findPhoneNumberAndEmailUserById(req, res) {
    UserModel.find(
      { _id: req.params.id },
      { phoneNumber: 1, email: 1 },
      (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      }
    );
  }

  //[GET] /user/findProvisionalInvoiceLasted
  findProvisionalInvoiceLasted(req, res) {
    BillModel.find({}, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    })
      .sort({ _id: -1 })
      .limit(1);
  }

  //[PUT] /user/officialInvoiceById/:id
  officialInvoiceById(req, res, next) {
    BillModel.updateOne(
      { _id: req.params.id },
      { state: 0, price: req.body.price }
    )
      .then((result) => res.json(result))
      .catch(next);
  }

  // [POST] /user/findBill
  findBill(req, res, next) {
    BillModel.find(
      {
        $and: [
          { theaterId: req.body.theaterId },
          { showtime: req.body.showtime },
          { filmId: req.body.film.id },
          { roomName: req.body.roomName },
          { state: 0 },
        ],
      },
      (err, result) => {
        if (result) {
          res.json(result);
          console.log(result);
        } else {
          res.json(err);
        }
      }
    );
  }

  // [GET] /user/findUserById/:id
  findUserById(req, res, next) {
    UserModel.findOne({ _id: req.params.id }, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }

  //[PUT] /user/updateUserById/:id
  updateUserById(req, res, next) {
    UserModel.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }

  //[PUT] /user/deleteAccount/:id
  deleteAccount(req, res, next) {
    UserModel.findByIdAndUpdate(
      req.params.id,
      { state: false },
      (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      }
    );
  }

  //[GET] /user/findBillByUserById/:id
  findBillByUserById(req, res, next) {
    BillModel.find(
      {
        $and: [{ userId: req.params.id }, { state: 0 }],
      },
      (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      }
    );
  }

  //[POST] /user/feedback
  feedback(req, res, next) {
    const feedback = req.body;
    const newFeedback = new FeedbackModel(feedback);
    newFeedback.save();
    res.json(feedback);
  }

  //[GET] /user/findAllFeedback
  findAllFeedback(req, res) {
    FeedbackModel.find({}, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    })
      .sort({ createdAt: -1 })
      .limit(10);
  }

  // [POST] /user/sendLetter
  sendLetter(req, res, next) {
    const options = {
      from: `VOSTRO CINEMA <${process.env.USER}>`,
      to: req.body.email,
      subject: "Thư xác nhận",
      html: `<table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                  <td bgcolor="#FFA73B" align="center">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                              <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                          </tr>
                      </table>
                  </td>
              </tr>
              <tr>
                  <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                              <td bgcolor="#ffffff" align="center" valign="top"
                                  style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                  <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img
                                      src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120"
                                      style="display: block; border: 0px;" />
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
              <tr>
                  <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                              <td bgcolor="#ffffff" align="left"
                                  style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                  <p style="margin: 0;">Cám ơn bạn đã gửi CV về cho hệ thống. Tiếp tục trải nghiệm website, bấm vào nút bên dưới.</p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#ffffff" align="left">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                      <tr>
                                          <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                              <table border="0" cellspacing="0" cellpadding="0">
                                                  <tr>
                                                      <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a
                                                              href="https://vostro-cinama.netlify.app/" target="_blank"
                                                              style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">VOSTRO CINEMA</a></td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr> <!-- COPY -->
                          <tr>
                              <td bgcolor="#ffffff" align="left"
                                  style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                  <p style="margin: 0;">Chúng tôi sẽ xem xét và thông báo kết quả sớm nhất có thể. Nhớ thường xuyên kiểm tra gmail này bạn nhé !!!</p>
                              </td>
                          </tr>
                          <tr>
                              <td bgcolor="#ffffff" align="left"
                                  style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                  <p style="margin: 0;">Chào bạn,<br>VOSTRO CINEMA</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>

          </table>`,
    };
    let transpoter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.USER, // email
        pass: process.env.PASSWORD, //password
      },
    });
    transpoter.sendMail(options).then((result) => res.json(result));
  }
}
module.exports = new User();
