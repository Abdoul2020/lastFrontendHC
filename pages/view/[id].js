import React, { useEffect } from "react";
import { useState } from "react";

import ProfilePageButton from "../../components/profile-page-button";

import { useSelector, useDispatch } from "react-redux";
import GlobalControllerLayout from "../../layouts/global-controller-layout";
import { useRouter } from "next/router";
import userSlice, {
  deleteProfileAsync,
  updateProfileAsync,
  changeAccountTypeNormalToPremium,
  profileImageUploadAsync,
  updateProfileBackgroundAsync,
  themeChangeAsync,
  getUserAsync,
  AddBillInfoDataAsync,
  changegePasswordAsync,

  updateDenemeToisStandartTrue,
  updateDenemeToiPremiumTrue,
  updateDenemeToisDenemeTrue,
  upadateHideTotrue
} from "../../stores/userSlice";

import ImageLoader from "react-imageloader";

import NumberFormat from "react-number-format";
import { tr } from "faker/lib/locales";
import SocialMedia from "../../components/social_media";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Grid, Hidden } from "@mui/material";
import Button from "@mui/material/Button";

import vipLogo from "../../public/images/hibritcard-vip-icon.png";
import copy from "copy-to-clipboard";

import ReactCodeInput from "react-verification-code-input";
import { lineHeight } from "@material-ui/system";
import { padding } from "@mui/system";



// radio Button react mui
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';



function View() {
  const userData = useSelector((state) => state.userSlice.user);

  const [accountTypeFrom, setaccountTypeFrom] = useState(false);

  const [verificationCode, setverificationCode] = useState(""); ///verification code from here

  const [hideLogoFromHere, sethideLogoFromHere]= useState(false)

  

  const [profileImage, setProfileImage] = useState(null);
  const [createProfileImageURL, setCreateProfileImageURL] = useState(null);

  const [profileBGImage, setProfileBGImage] = useState(null);
  const [createProfileBGImageURL, setCreateProfileBGImageURL] = useState(null);

  function preloader() {
    return <img className="loader" src="/images/Spin-1s-200px.svg" />;
  }

  const dispatch = useDispatch();

  const router = useRouter();
  const { id } = router.query;

  const count = useSelector((state) => state.registerSlice.value);


  const NormalToPremiumStatus = useSelector(
    (state) => state.userSlice.accountTypeChangeStatus
  );

  const profile = useSelector((state) => state.userSlice.profiles);

  const selectedProfileId = useSelector(
    (state) => state.userSlice.selectProfileId
  );



  useEffect(() => {
    console.log("Huuuub",profile )

    

  }, [profile])


  console.log("prroooo",  profile &&
  profile != undefined && profile.length > 0
    ? profile.find((s) => s.profileId == selectedProfileId)
    : []);

    console.log("ewrr::",selectedProfileId, "agau",
     profile.find((s) => s.profileId) )



  const selectedProfilData = profile &&
    profile != undefined && profile.length > 0
      ? profile.find((s) => s.profileId == selectedProfileId)
      : [];





  const [profileData, setProfileData] = useState(selectedProfilData);
  const [profileTheme, setProfileTheme] = useState(null);

  const [imagaErorText, setImagaErorText] = useState("");


  

  function recallUserData() {
    dispatch(getUserAsync()).then(() => {
      setcodeVerificationSuccess(false);
      setcodeVeririficationFail(false);
      setkodValueExist(false);
    });
  }

  useEffect(() => {

     if(selectedProfilData && selectedProfilData!== undefined && selectedProfilData.length > 0 ){

console.log("hhdsj")
      setProfileTheme(selectedProfilData && selectedProfilData.profileTheme);
    setProfileData(selectedProfilData);
    
     }

  }, [selectedProfilData]);

  /* profil image start */

  useEffect(() => {
    emailFormatController();
    emailFormatController2();
  }, [profileData]);

  const uploadToClientProfile = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImagaErorText("");
      const image = event.target.files[0];
      //if (image.size < 2097152) {
      setProfileImage(image);
      setCreateProfileImageURL(URL.createObjectURL(image));
      //}
      //else {
      // setImagaErorText("Dosya 2MB' ten b??y??kt??r!");
      // }
    }
  };

  const profileImageUploadToServer = (event) => {
    const body = new FormData();
    body.append("file", profileImage);
    const data = { profileId: selectedProfileId, profileImage: body };

    dispatch(profileImageUploadAsync(data));

    /*  const response = await axios.post(`https://us-central1-hibritardpro.cloudfunctions.net/api/uploadProfile/${data.profileId}`, data.profileImage, {
              headers: {
                  'Authorization': localStorage.getItem("GZIToken")
              }
          });*/
  };
  /* profil image finish */

  /* profil bg image start */
  const uploadToClientProfileBG = (event) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      setImagaErorText("");

      // if (image.size < 2097152) {
      setProfileBGImage(image);
      setCreateProfileBGImageURL(URL.createObjectURL(image));

      //}
      //else {
      // setImagaErorText("Dosya 2MB' ten b??y??kt??r!");
      //}
    }
  };

  const profileBGImageUploadToServer = async (event) => {
    const body = new FormData();
    body.append("file", profileBGImage);
    const data = { profileId: selectedProfileId, profileImage: body };

    dispatch(updateProfileBackgroundAsync(data));
    /*const response = await axios.post(`https://us-central1-hibritardpro.cloudfunctions.net/api/uploadProfile/${data.profileId}`, data.profileImage, {
            headers: {
                'Authorization': localStorage.getItem("GZIToken")
            }
        });*/
  };
  /* profil bg image finish */

  function save() {
    // if (!profileInputErrors.emailFormatError) {

    dispatch(updateProfileAsync(profileData));

    if (profileImage) {
      profileImageUploadToServer();
    }

    if (profileBGImage) {
      profileBGImageUploadToServer();
    }

    // }

    //  console.log(profileData && profileData.placeOfSocialMediaPosition);
  }

  function billSave() {
    if (!profileInputErrors.emailFormatError) {
      const billValues = {
        taxNumber: profileData.taxNumber,
        taxAdministration: profileData.taxAdministration,
        companyStatus: profileData.companyStatus,
        officeEmail: profileData.officeEmail,
        officePhoneNumber: profileData.officePhoneNumber,
        location: profileData.location,
        selectedProfileId: selectedProfileId,
      };

      dispatch(AddBillInfoDataAsync(billValues));
      if (profileImage) {
        profileImageUploadToServer();
      }
      if (profileBGImage) {
        profileBGImageUploadToServer();
      }
    }

    //  console.log(profileData && profileData.placeOfSocialMediaPosition);
  }

  const [profileInputErrors, setProfileInputErrors] = useState([{}]);

  function emailFormatController() {
    if (profileData && profileData.profileEmail != "") {
      const pattern =
        /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
      const result = pattern.test(profileData.profileEmail);
      setProfileInputErrors((prevState) => ({
        ...prevState,
        emailFormatError: !result ? true : false,
      }));
    }
  }

  function emailFormatController2() {
    if (profileData && profileData.officeEmail != "") {
      const pattern =
        /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
      const result = pattern.test(profileData.officeEmail);

      setProfileInputErrors((prevState) => ({
        ...prevState,
        emailFormatError2: !result ? true : false,
      }));
    }
  }

  function variableUpdateController() {
    if (profileInputErrors.emailFormatError) {
      setProfileInputErrors((prevState) => ({
        ...prevState,
        variableUpdateError: true,
      }));
    } else {
      setProfileInputErrors((prevState) => ({
        ...prevState,
        variableUpdateError: false,
      }));
    }
  }

  useEffect(() => {
    variableUpdateController();
  }, [profileInputErrors.emailFormatError]);

  const [state, setState] = useState("");

  useEffect(() => {
    dispatch(
      themeChangeAsync({
        profileId: selectedProfileId,
        profileTheme: profileTheme,
      })
    );
  }, [profileTheme]);

  const themeChange = (e) => {
    setProfileTheme(e);
  };

  const [deletePopup, setDeletePopup] = useState(false);

  const [deleteTagController, setDeleteTagController] = useState({
    value: "",
    error: false,
  });

  function profileDelete() {
    
    // if (deleteTagController.value == profileData.profileTag) {

      console.log("onghufclick")
      dispatch(deleteProfileAsync(selectedProfileId));
      localStorage.removeItem("selectedProfileId");
      router.push("/select-profile");
    // } else {

      // setDeleteTagController((v) => ({ ...v, error: true }));

    ///}
  }

  //check the popup for hibrit Logo Kald??r

  const [checkRight, setcheckRight] = useState(false);

  //bank popu and Pay
  const [bankPopup, setbankPopup] = useState(false);

  //bilgilendirme Popu here
  const [bilgilendirPopup, setbilgilendirPopup] = useState(false);

  //bank Info Here
  const [bankInfoPopup, setbankInfoPopup] = useState(false);

  //check kod verification to Premium
  const [kodValueExist, setkodValueExist] = useState(false);
  const [code, setCode] = useState([]);

  const [codeVerificationSuccess, setcodeVerificationSuccess] = useState(false);
  const [codeVeririficationFail, setcodeVeririficationFail] = useState(false);

  const [existSecretKod, setexistSecretKod] = useState(true);


  useEffect(() => {
    dispatch(getUserAsync());
  }, []);

  //CAHNEG tYPE of this
  useEffect(() => {


    if (NormalToPremiumStatus !== null && NormalToPremiumStatus === "success") {
      setcodeVerificationSuccess(true);
    }
  }, [NormalToPremiumStatus]);

  function verification() {
    let codeValue = "";
    for (let i = 0; i < code.length; i++) {
      codeValue += code[i];
    }
    


    //acounType must be implemented on the user account before provision
    if (codeValue + "P" === verificationCode) {
      //her will be Kontrol from here
      dispatch(
        changeAccountTypeNormalToPremium({
          secretKod: userData.secretKod,
          accountType: "Premium",
        })
      );

      //dispatch will be here
    } else {
      setcodeVeririficationFail(true);
    }

    //setverificationCode

    // const data = {
    ///secretKod: localStorage.getItem("cardUrlLinksId"),
    //   verificationCode: codeValue

    // }
    //dispatch(loginWithCardUrlAsync(data));
  }

  //check this right
  function checkRightTis() {

    if (userData !== null && userData.secretKod) {

      setcheckRight(!checkRight);

    } else {
      setexistSecretKod(false);
    }

  }

  //Credit card ??nfo later
  const [laterCreditCard, setlaterCreditCard] = useState(false);

  const [KontorlpopupStandrat, setKontorlpopupStandrat]= useState(false);

  const [standartCheck , setstandartCheck]= useState(false);
  const [premiumCheck, setpremiumCheck] = useState(false);

  //value chanege of oaccount Type standart
  const [premiumCheckValue, setpremiumCheckValue] = useState("");
  const [standartCheckValue , setstandartCheckValue]= useState("");


  //First load Premium Page
  const [firstLoadPremiumPopup,setfirstLoadPremiumPopup]= useState(true);



  //deneme bu
  function updateDenemeTrue(){

    dispatch(updateDenemeToisDenemeTrue())


  }

  //standart bu here
  function upateStandartTrue(){

    dispatch(updateDenemeToisStandartTrue())
  }

  //premium bu heer
  function upatePremiumTrue(){

    dispatch(updateDenemeToiPremiumTrue())
  }


  const [cardNotPermission, setcardNotPermission] = useState(false);
  const [accountFirstTwoMonth, setaccountFirstTwoMonth] = useState(false);
  const [accoutTypeNormal, setaccoutTypeNormal] = useState(false);
  const [accountTypePremium, setaccountTypePremium] = useState(false);
  const [normalAccountOneYear, setnormalAccountOneYear] = useState(true);
  const [premiumAccountOneYear, setpremiumAccountOneYear] = useState(true);


  useEffect(() => {


    if (userData !== null && userData.accountType === "Premium" ) {
      setaccountTypeFrom(true);
    }

    if (userData !== null && userData.hideLogo !== undefined  ) {
        setcheckRight(userData.hideLogo);
      }


    if (userData !== null && userData.accountNormalTo) {
      setverificationCode(userData.accountNormalTo);
    }





    var StartAccoutDate =
      userData && userData !== null ? userData.startDateCount : "";
    var carverificationCode =
      userData && userData !== null && userData.verificationCode
        ? userData.verificationCode
        : "";
    var accountType =
      userData && userData !== null && userData.accountType
        ? userData.accountType
        : "";
    var currentDate = new Date().toJSON();

    var accountTypeStartDate =
      userData && userData !== null ? userData.accountTypeStartDate : "";

    var date1 = new Date(StartAccoutDate);
    var date2 = new Date(currentDate);

    var typeStartDate = new Date(accountTypeStartDate);

    var Difference_In_Time = date2.getTime() - date1.getTime();

    var Difference_In_Time_TypeStartDate =
      date2.getTime() - typeStartDate.getTime();

    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    var Diffrence_In_Days_StartDateCount =
      Difference_In_Time_TypeStartDate / (1000 * 3600 * 24);

      console.log("TimeInChange::", Diffrence_In_Days_StartDateCount)
      console.log("TimeInExhc::", Difference_In_Days)


    if (Difference_In_Days >= 15 && carverificationCode === "") {

      setcardNotPermission(true);

    } 

     if (Diffrence_In_Days_StartDateCount <= 60) {

      //setaccountFirstTwoMonth(true);

    }

    if (Diffrence_In_Days_StartDateCount >= 364 && accountType === "Normal") {

      setnormalAccountOneYear(false);
      
    } else if (
      Diffrence_In_Days_StartDateCount >= 364 &&
      accountType === "Premium"
    ) {
      setpremiumAccountOneYear(false);

      dispatch(
        changeAccountTypeNormalToPremium({
          secretKod: userData !== null ? userData.secretKod : "",
          accountType: "Normal",
        })
      );
    }

    //   set Normal and Premium account

    if (accountType === "Normal") {
      setaccoutTypeNormal(true);
    } else if (accountType === "Premium") {
      setaccountTypePremium(true);
    }
  }, [userData]);

  function hideLogoTo (){
    dispatch(upadateHideTotrue({
        hideLogo: !checkRight
    }))
  }



  return (
    <>
      <GlobalControllerLayout>
        {deletePopup ? (
          <div className="popup-global">
            <div
              onClick={() => setDeletePopup(false)}
              className="popup-top"
            ></div>
            <div className="popup">
              <div
                onClick={() => setDeletePopup(false)}
                className="close-button"
              >
                <i
                  className="fa-solid fa-xmark"
                  style={{
                    color: "#D9D9D9",
                  }}
                ></i>
              </div>
              <div className="header-text">Profili Sil</div>

              {/* new imported div */}

              <div className="panel-inner-content">
                <div
                  className="panel-inner-content-info"
                  style={{
                    textAlign: "center",
                    fontFamily: "Montserrat",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "11px",
                    lineHeight: "13px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  Silmek istedi??inizden emin misiniz ?
                </div>

                <div className="yes-no-buttons">



                <div
                    className="global-button yes-button"
                    //onClick={delteContactData}
                    onClick={() => profileDelete()}
                    style={{
                      fontFamily: "Montserrat",
                      fontStyle: "normal",
                      fontWeight: "700",
                      fontSize: "13px",
                      lineHeight: "16px",
                      textAlign: "center",
                      color: "#FFFFFF",
                      backgroundColor: " #D9D9D9",
                    }}
                  >
                    Evet{" "}
                  </div>

                  <div className="yes-no-space "> </div>

                  <div
                    className="global-button no-button"
                    onClick={() => setDeletePopup(false)}
                    style={{
                      fontFamily: "Montserrat",
                      fontStyle: "normal",
                      fontWeight: "700",
                      fontSize: "13px",
                      lineHeight: "16px",
                      textAlign: "center",
                      color: "#FFFFFF",
                      backgroundColor: "#9ed5ff",
                    }}
                  >
                    Hay??r
                  </div>{" "}
                 
                 



                </div>
              </div>

              {/* end of div */}

              {/* <div className='description-text'>
                                Profil etiketini yaz??n??z  "{profileData && <span style={{ color: "red" }}>{profileData.profileTag}</span>}"
                            </div>
                            <div className='popup-input '>
                                <div className="content-input"><input value={deleteTagController.value} onChange={(e) => setDeleteTagController(v => ({ ...v, value: e.target.value, error: false }))} type="text" placeholder="Porfil Etiketi" /></div>
                            </div>
                            <div className='description-text'>
                                {deleteTagController.error && <div style={{
                                    marginBottom: "20px",
                                    color: "red",
                                }}>L??tfen profil etiketini do??ru giriniz.</div>}
                            </div>
                            <div className='popup-button' >
                                <button onClick={() => profileDelete()} className='profile-save-button'>Profili Sil</button>
                            </div> */}
            </div>
          </div>
        ) : (
          ""
        )}



{
  codeVerificationSuccess && (
  <div className="popup-global-center">
  <div className="popup-top"></div>
  <div className="popup">
    {/* <div onClick={() => { setNewProfilePopup(false); setNewProfileError() }} className='close-button'>
<i className="fa-solid fa-xmark"></i>
</div> */}


    <div
      style={{
        textAlign: "center",
        color: "red",
      }}
    >
      <i class="fa-solid fa-circle-exclamation"></i>
    </div>

    <div className="header-text">Bilgilendirme</div>

    <div
      style={{
        paddingLeft: "30px",
        paddingRight: "30px",
        paddingBottom: "20px",
        color: "rgba(0, 0, 0, 0.5)",
        textAlign:"center"
      }}
    >

<strong>
Premium hesab??n??z aktive edilmi??tir. <br />
G??zel g??nlerde kullanman??z?? dileriz. <br />

</strong>

     <br />
     
      
      <span style={{
          width: "100%",
          fontWeight: "500",
          fontSize: "14px",
          lineHeight: "12px",
      }}>
        Premium hesap ile 6 adete kadar Profil olu??turabilir ve geli??mi?? aray??z ??zelliklerini deneyimleyebilisiniz. <br />

      </span>

         <br />
         <br />
    </div>

    {/* <div className='popup-input '>
<div className="content-input"><input value={newProfile.profileTag} onChange={(e) => setNewProfile(v => ({ ...v, profileTag: e.target.value }))} type="text" placeholder="Porfil Etiketi" /></div>
</div> */}
    {/* <div className='error-text' >
{newProfileError}
</div> */}

    <div
      className="popup-button"
      onClick={() => {
        setkontrolcheckFromFirstRegis(true);
      }}
    >
      <button className="profile-save-buttonn"  onClick={(e)=>{e.preventDefault()  ;setkontrolCheckFirstStandart(false); upatePremiumTrue() }} >Tamam</button>
    </div>

  </div>
</div>


  )
}


        {

  userData && userData.isStanadrtTrue === undefined && userData.accountType === "Normal" &&  (

    <div className="popup-global-center">
    <div className="popup-top"></div>
    <div className="popup">

      {/* <div onClick={() => { setNewProfilePopup(false); setNewProfileError() }} className='close-button'>
<i className="fa-solid fa-xmark"></i>
</div> */}


      <div
        style={{
          textAlign: "center",
          color: "red",
        }}
      >
        <i class="fa-solid fa-circle-exclamation"></i>
      </div>

      <div className="header-text">Bilgilendirme</div>

      <div
        style={{
          paddingLeft: "30px",
          paddingRight: "30px",
          paddingBottom: "20px",
          color: "rgba(0, 0, 0, 0.5)",
          textAlign:"center"
        }}

      >

<strong>
Standart hesab??n??z aktive edilmi??tir. <br />
G??zel g??nlerde kullanman??z?? dileriz. <br />

</strong>

       
       
        <br />
        Premium Hesap 2 Ay Boyunca Hediye! <br /> <br />

        <span style={{
            width: "100%",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "12px",
        }}>
        Hibrit Card taraf??ndan  hediye edilen Premium hesab??n??z??  2 ay s??re ile deneyebilirsiniz.

        </span>

           <br />
           <br />
           
           <span style={{
             textAlign: "center",
             width: "100%",
             margin: "20px",
             fontFamily: "Montserrat",
             fontStyle: "normal",
             fontWeight: "500",
             fontSize: "14px",
             lineHeight: "12px",
             textDecorationLine: "underline",
             color: " #9ED5FF",
             // color:"rgb(139, 141, 255)",

           }} onClick={()=>{setbankInfoPopup(true); setKontorlpopupStandrat(true) }}>

            Premium Hesab?? ??imdi Sat??n Al
            
           </span>
      </div>


      <div
        className="popup-button"
        onClick={() => {
          setlaterCreditCard(false);
          upateStandartTrue()
        }}
      >
        <button className="profile-save-buttonn">Tamam</button>
      </div>
    </div>
  </div>

)
        }

        {/* Validate kod form here */}

        {kodValueExist && (
          <div className="popup-global">
            <div className="popup-top"></div>

            <div className="popup">
              {codeVerificationSuccess === false &&
                codeVeririficationFail === false && (
                  <div>
                    <div
                      className="close-button"
                      onClick={() => {
                        setkodValueExist(false);
                      }}
                    >
                      <i
                        className="fa-solid fa-xmark"
                        style={{
                          color: "#D9D9D9",
                        }}
                      ></i>
                    </div>

                    <div className="header-text">
                      L??tfen 6 haneli Lisans kodu giriniz.
                    </div>

                    <div className="sms-code-area">
                      <ReactCodeInput
                        onChange={(e) => setCode(e)}
                        onComplete={() => {
                          verification();
                        }}
                        values={code}
                        type="text"
                        className="box"
                        autoFocus={true}
                        fieldWidth="35px"
                        fieldHeight="50px"
                      />
                    </div>

                    {/* {verificationCodeError && <div className='error-text'>Girdi??iniz kod hatal?? tekrar giriniz.</div>}

{verificationCodeSuccess && <div className='success-text'>Kart??n??z ile profiliniz ba??ar??l?? bir ??ekilde e??le??tirildi.</div>} */}

                    {/* onClick={() => verification()} */}

                    <div className="content-buttons-row profile-save-buttonn">
                      <div
                        className="global-button content-buttons-item primary-button"
                        style={{
                          backgroundColor: "transparent",
                          borderRadius: "0px",
                          padding: "5px",
                        }}
                        onClick={() => verification()}
                      >
                        Do??rula
                      </div>
                    </div>
                  </div>
                )}

              {/* {codeVerificationSuccess && (
                <div className="sms-code-area">
                  <div
                    className="close-button"
                    onClick={() => recallUserData()}
                  >
                    <i
                      className="fa-solid fa-xmark"
                      style={{
                        color: "#D9D9D9",
                      }}
                    ></i>
                  </div>
                  <div>


                    <img
                      src="https://www.freeiconspng.com/thumbs/success-icon/success-icon-10.png"
                      alt=""
                      style={{ maxWidth: "80px" }}
                    />

                  </div>
                </div>
              )} */}

              {codeVeririficationFail && (
                
                <div className="sms-code-area">
                  <div
                    className="close-button"
                    onClick={() => recallUserData()}
                  >
                    <i
                      className="fa-solid fa-xmark"
                      style={{
                        color: "#D9D9D9",
                      }}
                    ></i>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4436/4436559.png"
                      alt=""
                      style={{ maxWidth: "40px" }}
                    />

                    
                    <div  style={{marginTop:"10px"}}>


                      <span>
                      Hatal?? Aktivasyon Kodu 
                      </span>
                           
                          </div> <br />
                    

                    <div
                      className="content-buttons-row profile-save-buttonn"
                      style={{
                        padding: "0px",
                        borderRadius: "0px",
                        margin: "0px",
                      }}
                    >
                      <div
                        className="global-button content-buttons-item primary-button"
                        style={{
                          backgroundColor: "transparent",
                          borderRadius: "0px",
                          padding: "5px",
                        }}
                      >
                        <div
                          style={{ justifyContent:"space-around" }}
                          onClick={() => {
                            setcodeVerificationSuccess(false);
                            setcodeVeririficationFail(false);

                          }}
                        >
                          
                          <span>Tekrar Dene</span>

                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}



        {/* try account premium Check from heere */}

        {premiumCheck === true && userData && userData.isPremiumTrue === undefined && (
          <div className="popup-global">
            <div
              onClick={() =>{ setpremiumCheck(!premiumCheck);}}
              className="popup-top"
            ></div>
            <div className="popup">
              <div
                onClick={() =>{ setpremiumCheck(!premiumCheck);}}
                className="close-button"
              >
                <i
                  className="fa-solid fa-xmark"
                  style={{
                    color: "#D9D9D9",

                  }}
                ></i>
              </div>

              <div className="header-text">Premium Kart</div>

              {/* new imported div */}

              <div className="panel-inner-content">
                <div
                  className="panel-inner-content-info"
                  style={{
                    textAlign: "center",
                    fontFamily: "Montserrat",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "11px",
                    lineHeight: "13px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Grid container>
                    <Grid xs={12} sm={12} md={12} lg={12} style={{}}>
                        
                      <div
                      >
                        <div>
                          <img
                            style={{
                              maxWidth: "60px",
                              borderRadius: "100%",
                              objectFit: "cover",
                              padding: "0px",
                              margin: "0px",
                            }}
                            src="/images/hibritcard-vip-icon.png"
                            alt="Premium-Icon"
                          />
                        </div>



                        

                        <div
                          style={{
                            marginTop: "10px",
                            display:"inline-grid",
                            width:"100%",
                           
                            
                          }}

                          onClick={()=> setpremiumCheckValue("premium logosuz")}
                        >


<FormControl className="radioButtonTop">
     
     <RadioGroup
       aria-labelledby="demo-radio-buttons-group-label"
       defaultValue="female"
       name="radio-buttons-group"
     >
       <FormControlLabel value="female" control={<Radio  checked={premiumCheckValue==="premium logosuz"? true : false}/>}  />

     </RadioGroup>
   </FormControl>

                           

                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", overflow:"hidden", marginLeft:"0px" }}>

                                <div style={{ marginLeft:"40px"}}>
                                <span>
                                    <strong>
                                    Hibrit Card Tasar??m??
                                    </strong>
                               
                                </span>

                                </div>

                                <div style={{marginRight:"30px"}}>
                                <span>
                                    <strong>
                                    : 399 TL
                                    </strong>
                               
                                </span>
                                </div>
                                
                               
                            </div>

                            

                           

<div style={{width:"250px", marginLeft:"40px", textAlign:"start"}}>
    <span >
    Standart Tasar??ma Sahip Kart
    </span>
</div>


                          
                         

                        </div>


                        <div
                          style={{
                            marginTop: "10px",
                            display:"inline-grid",
                           
                            width:"100%",
                           
                            
                          }}


                          onClick={()=> setpremiumCheckValue("premium logolu")}
                        >


<FormControl className="radioButtonTop">
     
     <RadioGroup
       aria-labelledby="demo-radio-buttons-group-label"
       defaultValue="female"
       name="radio-buttons-group"
     >
       <FormControlLabel value="female" control={<Radio  checked={premiumCheckValue==="premium logolu"? true : false}/>}  />

     </RadioGroup>
   </FormControl>

                           

                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", overflow:"hidden",marginLeft:"40px" }}>

                                <div>
                                <span>
                                    <strong>
                                    Logolu Kart Tasar??m??
                                    </strong>
                               
                                </span>

                                </div>

                                <div style={{marginRight:"70px"}}>
                                <span>
                                    <strong>
                                    : 449 TL
                                    </strong>
                               
                                </span>
                                </div>
                                
                               
                            </div>

                            <div style={{width:"250px", marginLeft:"40px",textAlign:"start"}}>
                                <span>
                                Ad soyad, ??irket ??sim ve Logonuzu,
 kart??n??z ??zerine ekletebilirsiniz.
                                </span>
                           
                            </div>

   

</div>


                          
                         

                       

                        <div
                          style={{
                            marginTop: "10px",
                            display:"inline-grid",
                           
                            width:"100%",
                           
                            
                          }}

                          onClick={()=> setpremiumCheckValue("premium ozel")}
                        >

<FormControl className="radioButtonTop">
     
     <RadioGroup
       aria-labelledby="demo-radio-buttons-group-label"
       defaultValue="female"
       name="radio-buttons-group"
     >
       <FormControlLabel value="female" control={<Radio  checked={premiumCheckValue==="premium ozel"? true : false}/>}  />

     </RadioGroup>
   </FormControl>

                           

                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", overflow:"hidden", marginLeft:"40px" }}>

                                <div>
                                <span>
                                    <strong>
                                    ??zel Kart Tasar??m??
                                    </strong>
                               
                                </span>

                                </div>

                                <div style={{marginRight:"70px"}}>
                                <span>
                                    <strong>
                                    : 499 TL
                                    </strong>
                               
                                </span>
                                </div>
                                
                               
                            </div>

                            <div style={{width:"250px", marginLeft:"40px",textAlign:"start"}}>
                                <span>
                                Talep etti??iniz tasar??m?? kart??n??za uygulatabilirsiniz.
                                </span>
                            </div>
                        </div>

                       


                      

                        <Button
                          style={{
                            backgroundColor: "#8b8dff",
                            marginTop: "10px",
                            color: "#FFF",
                            textTransform:"inherit"
                          }}
                          onClick={() => setbankPopup(!bankPopup)}
                        >

                        Y??kselt

                        </Button>
                      </div>
                    </Grid>



                    {/* <Grid
                      style={{
                        textAlign: "center",
                        width: "100%",
                        margin: "20px",
                        fontFamily: "Montserrat",
                        fontStyle: "normal",
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "12px",
                        textDecorationLine: "underline",
                        color: " #9ED5FF",
                        // color:"rgb(139, 141, 255)"
                      }}
                      onClick={() => {
                        setkodValueExist(true);
                        setcheckRight(false);
                      }}
                    >
                      Zaten Lisans Kodum var
                    </Grid> */}
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        ) }


        {/* try account standart Popup */}

        {standartCheck === true && (
          <div className="popup-global">
            <div
              onClick={() =>{ setstandartCheck(!standartCheck); console.log("okkk",standartCheck )}}
              className="popup-top"
            ></div>
            <div className="popup">
              <div
                onClick={() =>{ setstandartCheck(!standartCheck); console.log("okyuuu",standartCheck )}}
                className="close-button"
              >
                <i
                  className="fa-solid fa-xmark"
                  style={{
                    color: "#D9D9D9",
                  }}
                ></i>
              </div>
              <div className="header-text">Standart Kart</div>

              {/* new imported div */}

              <div className="panel-inner-content">
                <div
                  className="panel-inner-content-info"
                  style={{
                    textAlign: "center",
                    fontFamily: "Montserrat",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "11px",
                    lineHeight: "13px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Grid container>
                    <Grid xs={12} sm={12} md={12} lg={12} style={{}}>
                        
                      <div
                      >
                        <div>
                          <img
                            style={{
                              maxWidth: "60px",
                              borderRadius: "100%",
                              objectFit: "cover",
                              padding: "0px",
                              margin: "0px",
                            }}
                            src="/images/hibritcard-vip-icon.png"
                            alt="Premium-Icon"
                          />
                        </div>



                        

                        <div
                          style={{
                            marginTop: "10px",
                            display:"inline-grid",
                           
                            width:"100%",
                            marginBottom:"20px"
                          }}


                          onClick={()=>{ setstandartCheckValue("standart logosuz")}}

                        >



    {/* standart logo bu */}

    <FormControl className="radioButtonTop">
     
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <FormControlLabel value="female" control={<Radio  checked={standartCheckValue==="standart logosuz"? true : false}/>}  />

      </RadioGroup>
    </FormControl>
    


                           

                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", overflow:"hidden", marginLeft:"0px" }}>


                        

                                <div style={{ marginLeft:"40px"}}>
                                <span>
                                    <strong>
                                    Hibrit Card Tasar??m??
                                    </strong>
                               
                                </span>

                                </div>

                                <div style={{marginRight:"30px"}}>
                                <span>
                                    <strong>
                                    : 349 TL
                                    </strong>
                               
                                </span>
                                </div>
                                
                               
                            </div>

                            

                           

<div style={{width:"250px", marginLeft:"40px", textAlign:"start"}}>
    <span >
    Standart Tasar??ma Sahip Kart
    </span>
</div>


                        </div>


                        <div
                          style={{
                            marginTop: "10px",
                            display:"inline-grid",
                           
                            width:"100%",
                            marginBottom:"20px"
                           
                            
                          }}

                          onClick={()=>{ setstandartCheckValue("standart logolu")}}
                        >


<FormControl className="radioButtonTop">
     
     <RadioGroup
       aria-labelledby="demo-radio-buttons-group-label"
       defaultValue="female"
       name="radio-buttons-group"
     >
       <FormControlLabel value="female" control={<Radio  checked={standartCheckValue==="standart logolu"? true : false}/>}  />
     </RadioGroup>
   </FormControl>
   

   

                           

                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", overflow:"hidden",marginLeft:"40px" }}>

                                <div>
                                <span>
                                    <strong>
                                    Logolu Kart Tasar??m??
                                    </strong>
                               
                                </span>

                                </div>

                                <div style={{marginRight:"70px"}}>
                                <span>
                                    <strong>
                                    : 399 TL
                                    </strong>
                               
                                </span>
                                </div>
                                
                               
                            </div>

                            <div style={{width:"250px", marginLeft:"40px",textAlign:"start"}}>
                                <span>
                                Ad soyad, ??irket ??sim ve Logonuzu,
 kart??n??z ??zerine ekletebilirsiniz.
                                </span>
                           
                            </div>

   

</div>


                          
                         

                       

                        <div
                          style={{
                            marginTop: "10px",
                            display:"inline-grid",
                           
                            width:"100%",
                            marginBottom:"20px"
                           
                            
                          }}

                          onClick={()=>{ setstandartCheckValue("standart ??zel")}}
                        >



<FormControl className="radioButtonTop">
     
     <RadioGroup
       aria-labelledby="demo-radio-buttons-group-label"
       defaultValue="female"
       name="radio-buttons-group"
     >
       <FormControlLabel value="female" control={<Radio  checked={standartCheckValue==="standart ??zel"? true : false}/>}  />

     </RadioGroup>
   </FormControl>
   

    





                           

                            <div style={{display:"flex", justifyContent:"space-between", width:"100%", overflow:"hidden", marginLeft:"40px" }}>

                                <div>
                                <span>
                                    <strong>
                                    ??zel Kart Tasar??m??
                                    </strong>
                               
                                </span>

                                </div>

                                <div style={{marginRight:"70px"}}>
                                <span>
                                    <strong>
                                    : 449 TL
                                    </strong>
                               
                                </span>
                                </div>
                                
                               
                            </div>

                            <div style={{width:"250px", marginLeft:"40px",textAlign:"start"}}>
                                <span>
                                Talep etti??iniz tasar??m?? kart??n??za uygulatabilirsiniz.
                                </span>
                            </div>
                        </div>

                       


                      

                        <Button
                          style={{
                            backgroundColor: "#8b8dff",
                            marginTop: "10px",
                            color: "#FFF",
                            textTransform:"inherit"
                          }}
                          onClick={() => setbankPopup(!bankPopup)}
                        >

                        Y??kselt
                        </Button>
                      </div>
                    </Grid>



                    {/* <Grid
                      style={{
                        textAlign: "center",
                        width: "100%",
                        margin: "20px",
                        fontFamily: "Montserrat",
                        fontStyle: "normal",
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "12px",
                        textDecorationLine: "underline",
                        color: " #9ED5FF",
                        // color:"rgb(139, 141, 255)"
                      }}
                      onClick={() => {
                        setkodValueExist(true);
                        setcheckRight(false);
                      }}
                    >
                      Zaten Lisans Kodum var
                    </Grid> */}





                  </Grid>
                </div>
              </div>
            </div>
          </div>
        ) }





        {checkRight === true && accountFirstTwoMonth===true &&accountTypePremium===false && userData && userData.verificationCode ? (
          <div className="popup-global">
            <div
              onClick={() => setcheckRight(!checkRight)}
              className="popup-top"
            ></div>
            <div className="popup">
              <div
                onClick={() => setcheckRight(!checkRight)}
                className="close-button"
              >
                <i
                  className="fa-solid fa-xmark"
                  style={{
                    color: "#D9D9D9",
                  }}
                ></i>
              </div>
              <div className="header-text">Premium Hesap</div>

              {/* new imported div */}

              <div className="panel-inner-content">
                <div
                  className="panel-inner-content-info"
                  style={{
                    textAlign: "center",
                    fontFamily: "Montserrat",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "11px",
                    lineHeight: "13px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Grid container>
                    <Grid xs={12} sm={12} md={12} lg={12} style={{}}>

                      <div
                        onClick={() => {
                          setbankPopup(true);
                          setcheckRight(false);
                        }}
                      >
                        <div>
                          <img
                            style={{
                              maxWidth: "60px",
                              borderRadius: "100%",
                              objectFit: "cover",
                              padding: "0px",
                              margin: "0px",
                            }}
                            src="/images/hibritcard-vip-icon.png"
                            alt="Premium-Icon"
                          />
                        </div>

                        <div
                          style={{
                            marginTop: "10px",
                          }}
                        >
                          Standart Hesaba Ek
                        </div>

                        <div
                          style={{
                            marginTop: "10px",
                          }}
                        >
                          Y??ll??k / 50 TL
                        </div>

                        <Button
                          style={{
                            backgroundColor: "#8b8dff",
                            marginTop: "10px",
                            color: "#FFF",
                          }}
                        >
                          Premium'a Ge??
                        </Button>
                      </div>
                    </Grid>

                    <Grid
                      style={{
                        textAlign: "center",
                        width: "100%",
                        margin: "20px",
                        fontFamily: "Montserrat",
                        fontStyle: "normal",
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "12px",
                        textDecorationLine: "underline",
                        color: " #9ED5FF",
                        // color:"rgb(139, 141, 255)"
                      }}
                      onClick={() => {
                        setkodValueExist(true);
                        setcheckRight(false);
                      }}
                    >
                      Zaten Lisans Kodum var
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}



        {/* bank Popup from Here */}

        {bankPopup === true ? (
          <div className="popup-global">
            <div
              onClick={() => setbankPopup(!bankPopup)}
              className="popup-top"
            ></div>
            <div className="popup">
              <div
                onClick={() => setbankPopup(!bankPopup)}
                className="close-button"
              >
                <i
                  className="fa-solid fa-xmark"
                  style={{
                    color: "#D9D9D9",
                  }}
                ></i>
              </div>
              <div className="header-text"> Hesap Y??kselt</div>
             
                <span style={{fontSize:"14px", textAlign:"center"}}> ??deme t??r??n?? a??a????dan se??ebilirsiniz</span>
             

              {/* new imported div */}

              <div className="panel-inner-content">
                <div
                  className="panel-inner-content-info"
                  style={{
                    textAlign: "center",
                    fontFamily: "Montserrat",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "11px",
                    lineHeight: "13px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Grid container>
                    <Grid xs={12} sm={12} md={12} lg={12} style={{}}>
                      <div
                        style={{
                          padding: "20px",
                        }}
                      >
                        <Grid container>
                          <Grid xs={12} sm={12} md={12} lg={12}>
                            <Grid
                              container
                              style={{
                                justifyContent: "space-between",
                              }}
                            >
                              <Grid
                                item
                                xs={5}
                                sm={5}
                                md={5}
                                lg={5}
                                style={{
                                  boxShadow:
                                    "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
                                  borderRadius: "14px",
                                  padding: "20px",
                                }}
                                onClick={() => {
                                  setbankInfoPopup(true);
                                  setbankPopup(false);
                                }}
                              >
                                <Grid
                                  style={{
                                    fontFamily: "Montserrat",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    fontSize: "11px",
                                    lineHeight: "13px",
                                    color: "rgba(0, 0, 0, 0.5)",
                                  }}
                                >
                                  Havale/EFT
                                </Grid>
                              </Grid>

                              <Grid
                                item
                                xs={5}
                                sm={5}
                                md={5}
                                lg={5}
                                style={{
                                  boxShadow:
                                    "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
                                  borderRadius: "14px",
                                  padding: "20px",
                                }}
                                onClick={() => setlaterCreditCard(true)}
                              >
                                <Grid
                                  style={{
                                    fontFamily: "Montserrat",
                                    fontStyle: "normal",
                                    fontWeight: "700",
                                    fontSize: "11px",
                                    lineHeight: "13px",
                                    color: "rgba(0, 0, 0, 0.5)",
                                  }}
                                >
                                  Kredi Kart??
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* <img  style={{
                                            maxWidth:"150px"
                                         }}
                                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Ziraat_Bankas%C4%B1_logo.svg/2560px-Ziraat_Bankas%C4%B1_logo.svg.png" alt="" /> */}
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {/* //later credit card ??nfo from here */}

        {laterCreditCard === true && (
          <div className="popup-global-center">
            <div className="popup-top"></div>
            <div className="popup">
              {/* <div onClick={() => { setNewProfilePopup(false); setNewProfileError() }} className='close-button'>
    <i className="fa-solid fa-xmark"></i>
</div> */}

              <div
                style={{
                  textAlign: "center",
                  color: "red",
                }}
              >
                <i class="fa-solid fa-circle-exclamation"></i>
              </div>

              <div className="header-text">Bilgilendirme</div>

              <div
                style={{
                  paddingLeft: "50px",
                  paddingRight: "50px",
                  paddingBottom: "20px",
                  color: "rgba(0, 0, 0, 0.5)",
                }}
              >
                Kredi Card ??deme sistemi yak??nda aktive edilecektir.
              </div>

             

              <div
                className="popup-button"
                onClick={() => {
                  setlaterCreditCard(false);
                }}
              >
                <button className="profile-save-buttonn">Tamam</button>
              </div>
            </div>
          </div>
        )}

        {/* Bilgilendirme Popup here */}

        {bilgilendirPopup === true && (
          <div className="popup-global-center">
            <div className="popup-top"></div>
            <div className="popup">
              {/* <div onClick={() => { setNewProfilePopup(false); setNewProfileError() }} className='close-button'>
    <i className="fa-solid fa-xmark"></i>
</div> */}

              <div
                style={{
                  textAlign: "center",
                  color: "red",
                }}
              >
                <i class="fa-solid fa-circle-exclamation"></i>
              </div>

              <div className="header-text">Bilgilendirme</div>

              <div
                style={{
                  paddingLeft: "50px",
                  paddingRight: "50px",
                  paddingBottom: "20px",
                  color: "rgba(0, 0, 0, 0.5)",
                  textAlign: "center",
                }}
              >
                ????leminizi EFT ile yapmak istiyorsan??z a??a????daki kodu ??deme
                a????klamas??na ekleyiniz. Aktivasyon i??lemi 2 saat i??erisinde
                ger??ekle??ecektir.
              </div>

              {/* <div className='popup-input '>
    <div className="content-input"><input value={newProfile.profileTag} onChange={(e) => setNewProfile(v => ({ ...v, profileTag: e.target.value }))} type="text" placeholder="Porfil Etiketi" /></div>
</div> */}
              {/* <div className='error-text' >
    {newProfileError}
</div> */}

              <div
                className="popup-button"
                onClick={() => {
                  setbankInfoPopup(true);
                  setbilgilendirPopup(false);
                }}
              >
                <button className="profile-save-buttonn">Tamam</button>
              </div>
            </div>
          </div>
        )}

        {/* card sat??n alman??z gerekiyor Message */}

        {existSecretKod === false && (
          <div className="popup-global-center">
            <div className="popup-top"></div>
            <div className="popup">
              <div
                onClick={() => {
                  setexistSecretKod(true);
                }}
                className="close-button"
              >
                <i className="fa-solid fa-xmark"></i>
              </div>

              <div
                style={{
                  textAlign: "center",
                  color: "red",
                }}
              >
                <i class="fa-solid fa-circle-exclamation"></i>
              </div>

              <div className="header-text">Bilgilendirme</div>

              <div
                style={{
                  paddingLeft: "50px",
                  paddingRight: "50px",
                  paddingBottom: "20px",
                  color: "rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* HibritCard Premium Hesab??na Ge??erken &nbsp;

    <strong>

    "a????klama kodu"

    </strong>
    &nbsp;
    yazmay?? unutmamal??s??n. */}
                Bu se??enek Premium Hesap sahipleri i??in aktiftir.
              </div>

              {/* <div className='popup-input '>
    <div className="content-input"><input value={newProfile.profileTag} onChange={(e) => setNewProfile(v => ({ ...v, profileTag: e.target.value }))} type="text" placeholder="Porfil Etiketi" /></div>
</div> */}
              {/* <div className='error-text' >
    {newProfileError}
</div> */}

             
                <div
                  className="popup-button"
                  onClick={() => {
                    setexistSecretKod(true);
                    setpremiumCheck(true)
                  }}
                >
                  <button className="profile-save-buttonn">
                    Y??kselt
                  
                  </button>
                </div>
             
            </div>
          </div>
        )}

        {/* bank Info Iban and all OF THAT */}

        {bankInfoPopup === true ? (
          <div className="popup-global">
            <div
              onClick={() => setbankInfoPopup(!bankInfoPopup)}
              className="popup-top"
            ></div>
            <div className="popup">
              <div
                onClick={() => {setbankInfoPopup(!bankInfoPopup); userData.isOpenFirstStandart === undefined ? setKontorlpopupStandrat(false) : setbankInfoPopup(!bankInfoPopup) }}
                className="close-button"
              >
                <i
                  className="fa-solid fa-xmark"
                  style={{
                    color: "#D9D9D9",
                  }}
                ></i>
              </div>
              <div className="header-text">Ziraat Bankas??</div>

              {/* new imported div */}

              <div className="panel-inner-content">
                <div
                  className="panel-inner-content-info"
                  style={{
                    textAlign: "center",
                    fontFamily: "Montserrat",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "11px",
                    lineHeight: "13px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Grid container>
                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{
                        margin: "10px",
                        padding:"10px 20px"
                      }}
                    >
                      Havale/EFT i??lemleriniz i??in Hibrit Card hesap bilgilerine
                      a??a????dan ula??abilirsiniz.
                    </Grid>

                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{
                        margin: "20px",
                      }}
                    >
                      <Grid container>
                        <Grid xs={12} sm={12} md={12} lg={12}>
                          <div
                            style={{
                              padding: "10px 20px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            <div
                              style={{
                                fontFamily: "Montserrat",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "11px",
                                lineHeight: "13px",
                              }}
                            >
                              Hesap Aktivasyon S??resi
                            </div>

                            <div
                              style={{
                                fontFamily: "Montserrat",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "11px",
                                lineHeight: "13px",
                              }}
                            >
                              Bir Saat
                            </div>
                          </div>
                        </Grid>

                        <Grid xs={12} sm={12} md={12} lg={12}>
                          <div
                            style={{
                              padding: "10px 20px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            <div
                              style={{
                                fontFamily: "Montserrat",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "11px",
                                lineHeight: "13px",
                              }}
                            >
                              Hesap Tipi
                            </div>

                            <div
                              style={{
                                fontFamily: "Montserrat",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "11px",
                                lineHeight: "13px",
                              }}
                            >
                              T??rk L??ras??
                            </div>
                          </div>
                        </Grid>

                        <Grid xs={12} sm={12} md={12} lg={12}>
                          <div
                            style={{
                              padding: "10px 20px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            <div
                              style={{
                                fontFamily: "Montserrat",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "11px",
                                lineHeight: "13px",
                              }}
                            >
                              IBAN
                            </div>

                            <div
                              style={{
                                display: "flex",
                              }}
                              onClick={() =>
                                copy("TR 5400 0100 2101 9748 8785??5006", {
                                  debug: true,
                                  message: "iban Kopyaland??.",
                                })
                              }
                            >
                              <div
                                style={{
                                  fontFamily: "Montserrat",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  fontSize: "11px",
                                  lineHeight: "13px",
                                  color: "#8b8dff",
                                }}
                              >
                                TR 5400 0100 2101 9748 8785??5006
                              </div>

                              <div
                                style={{
                                  marginLeft: "10px",
                                }}
                              >
                                <i
                                  class="far fa-copy"
                                  style={{
                                    color: "#8b8dff",
                                  }}
                                ></i>
                              </div>
                            </div>
                          </div>
                        </Grid>

                        <Grid xs={12} sm={12} md={12} lg={12}>
                          <div
                            style={{
                              padding: "10px 20px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            <div
                              style={{
                                fontFamily: "Montserrat",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "11px",
                                lineHeight: "13px",
                              }}
                            >
                              Al??c??
                            </div>

                            <div
                              style={{
                                fontFamily: "Montserrat",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "11px",
                                lineHeight: "13px",
                              }}
                            >
                              Hibritart Medya Reklam A.??
                            </div>
                          </div>
                        </Grid>

                        <Grid xs={12} sm={12} md={12} lg={12}>
                          <div
                            style={{
                              padding: "10px 20px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            <div
                              style={{
                                fontFamily: "Montserrat",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "11px",
                                lineHeight: "13px",
                              }}
                            >
                              A????klama Kodu
                            </div>

                            <div
                              style={{
                                display: "flex",
                              }}
                              onClick={() =>
                                copy(userData !== null ? userData.eMail : "", {
                                  debug: true,
                                  message: "iban Kopyaland??.",
                                })
                              }
                            >
                              <div
                                style={{
                                  fontFamily: "Montserrat",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  fontSize: "11px",
                                  lineHeight: "13px",
                                  color: "#8b8dff",
                                }}
                              >
                                {
                    userData !== null ? userData.eMail : ""
                   }
                              </div>

                              <div
                                style={{
                                  marginLeft: "20px",
                                }}
                              >
                                {/* <i class="fa-light fa-copy"></i> */}
                                {/* <i class="fa-brands fa-copy"></i> */}

                                {/* <i class="fas fa-copy"></i> */}
                                <i
                                  class="far fa-copy"
                                  style={{
                                    color: "#8b8dff",
                                  }}
                                ></i>
                              </div>
                            </div>
                          </div>
                        </Grid>

                        <Grid xs={12} sm={12} md={12} lg={12}>
                          <div
                            style={{
                              padding: "10px 20px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            <div
                              style={{
                                padding: "20px",
                                backgroundColor: "#C2e5ff",
                                borderRadius: "14px",
                                lineHeight: "1.5",
                              }}
                            >
                              ??deme i??lemin ba??ar??yla tamamlanabilmesi i??in
                              k??rm??z?? ile yaz??lm????
                              <br />
                               "
                             
                              <span style={{ color: "red" }}>
                                <strong>
                                  {userData !== null ? userData.eMail : ""}
                                </strong>
                              </span>
                              
                              "  <br /> mail adresini, banka uygulaman??z??n ??deme
                              ekran??ndaki A????klama b??l??m??ne kopyalay??n??z.
                              {/* Yukar??da yer Alan "A????klama" Kodunu para transfer a????klamas?? olarak yazman??z gerekiyor. */}
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="main-content ">
          {/**   <div className='danger-area'>
                    <div className='alert-icon'>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div className='alert-text'>
                        Deneme hesab??n??z??n kullan??m s??resi dolmu??tur.
                    </div>
                    <div className='global-button alert-button'>
                        Hesab?? Y??kselt
                    </div>
                </div>*/}
          <div className="main-container">




{/* premium part from here to send back */}


{
 profileData && profileData.verificationCode === undefined  && (


    <div className="main-card-global" style={{ marginTop:"15px"}}>
              <div className="main-card">
                <div className="main-card-header"> Hesap Aktivasyonu</div>

                <span style={{
                    color:"#808080",
                    padding:"10px 20px 16px 20px",
                    justifyContent:"center",
                    alignItems:"center",
                    display:"block",
                }}>
                    Hesab??n??z?? ??imdi  Standart  veya Premium  hesaba y??kseltebilirsiniz.


                </span>
                <br />
                <span style={{
                    color:"#808080",
                    padding:"10px 20px 16px 20px",
                   textAlign:"center",
                    display:"block"
                }}>

                    <strong>
                    ??imdi Sat??n Al??n

                    </strong>
                   
                </span>
            

                <div className="theme-buttons-global" style={{marginTop:"10px"}}>
                  <div className="theme-buttons" style={{ background:"#fff"}}>

                    <div
                      
                      style={{
                        textAlign: "center",
                        width: "100%",
                        margin: "20px",
                        fontFamily: "Montserrat",
                        fontStyle: "normal",
                        fontWeight: "500",
                        fontSize: "20px",
                        lineHeight: "12px",
                        textDecorationLine: "underline",
                        color: " #9ED5FF",
                        // color:"rgb(139, 141, 255)"

                      }}

                      onClick={()=> setstandartCheck(true)}
                     
                    >
                        <strong>
                        Standart

                        </strong>
                      
                    </div>
                    <div


style={{
    textAlign: "center",
    width: "100%",
    margin: "20px",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "20px",
    lineHeight: "12px",
    textDecorationLine: "underline",
    color: " #9ED5FF",
    // color:"rgb(139, 141, 255)"
}}

onClick={()=> setpremiumCheck(true)}
                      
                    >

                        <strong>

                        Premium
                        </strong>
                   
                    </div>
                  </div>
                </div>
              </div>
            </div>
)

}


         





            {/* //selcet this form heer */}
            <div className="main-card-global">


              <div
                className="main-card"
                style={{
                  marginTop: "15px",
                }}
              >
                <div className="main-card-header">
                  {profileData && profileData.profileTag}
                </div>

                <div className="background-image-area">
                  <div className="headerImage">
                    <ImageLoader
                      src={
                        createProfileBGImageURL
                          ? createProfileBGImageURL
                          : profileData && profileData.backgorundImage
                      }
                      wrapper={React.createFactory("div")}
                      preloader={preloader}
                    >
                      Image load failed!
                    </ImageLoader>
                  </div>
                  <label htmlFor="profile-bg-image" className="edit-icon">
                    <input
                      id="profile-bg-image"
                      accept="image/jpeg, image/png"
                      type="file"
                      onChange={(e) => uploadToClientProfileBG(e)}
                    />
                    <img src="/icons/Edit_circle-White.svg" />
                  </label>
                </div>

                <div className="profile-image-area">
                  <div className="profile-image">
                    <ImageLoader
                      src={
                        createProfileImageURL
                          ? createProfileImageURL
                          : profileData && profileData.profileUrl
                      }
                      wrapper={React.createFactory("div")}
                      preloader={preloader}
                    >
                      Image load failed!
                    </ImageLoader>
                  </div>
                </div>

                <div className="profile-image-add">
                  <label htmlFor="profile-image">
                    <input
                      id="profile-image"
                      accept="image/jpeg, image/png"
                      type="file"
                      onChange={(e) => uploadToClientProfile(e)}
                    />
                    <div className="image-add-button">
                      Profil foto??raf?? ekle
                    </div>
                  </label>
                  {imagaErorText != "" && (
                    <div className="error-text">{imagaErorText}</div>
                  )}
                </div>

                <div className="content-in content-input-padding">
                  {/* <div className='content-input'>
                                        {profileInputErrors && profileInputErrors.variableUpdateError && <div className='error-text'>Hatal?? alanlar?? d??zeltiniz.</div>}
                                    </div>  */}
                </div>
                <div onClick={() => save()} className="profile-save-button">
                  Kaydet
                </div>
              </div>




            </div>

            <div className="main-card-global">
              <div className="main-card ">
                <div className="main-card-header">Profil Ayarlar??</div>

                <div className="content-in content-input-padding">
                  <div className="content-input">
                    <input
                      value={profileData && profileData.profileTag}
                      onChange={(e) =>
                        setProfileData((v) => ({
                          ...v,
                          profileTag: e.target.value,
                        }))
                      }
                      type="text"
                      placeholder="Profil Etiketi"
                    />
                  </div>

                  <div className="content-input-row">
                    <div className="content-input-item "></div>
                    <span className="content-input-space"></span>
                    <div className="content-input-item "></div>
                  </div>

                  <div className="content-input">
                    <input
                      type="text"
                      value={profileData && profileData.profileCompany}
                      onChange={(e) =>
                        setProfileData((v) => ({
                          ...v,
                          profileCompany: e.target.value,
                        }))
                      }
                      placeholder="??irket ??smi"
                    ></input>
                  </div>

                  <div className="content-input-row">
                    <input
                      autocomplete="first-name"
                      name="firstName"
                      type="text"
                      value={profileData && profileData.publicName}
                      onChange={(e) =>
                        setProfileData((v) => ({
                          ...v,
                          publicName: e.target.value,
                        }))
                      }
                      placeholder="??sim"
                    />

                    <span className="content-input-space"></span>

                    <input
                      autocomplete="family-name"
                      name="lastName"
                      type="text"
                      value={profileData && profileData.publicSurName}
                      onChange={(e) =>
                        setProfileData((v) => ({
                          ...v,
                          publicSurName: e.target.value,
                        }))
                      }
                      placeholder="Soyisim"
                    />
                  </div>

                  <div className="content-input">
                    {profileData && (
                      <>
                        <input
                          autocomplete="position"
                          name="position"
                          type="text"
                          value={profileData.position}
                          onChange={(e) =>
                            setProfileData((v) => ({
                              ...v,
                              position: e.target.value,
                            }))
                          }
                          placeholder="Profile ??nvan??"
                        />
                        <textarea
                          autocomplete="description"
                          name="description"
                          placeholder="Profil A????klamas??"
                          value={profileData.profilDescription}
                          onChange={(e) =>
                            setProfileData((v) => ({
                              ...v,
                              profilDescription: e.target.value,
                            }))
                          }
                        ></textarea>
                      </>
                    )}
                  </div>
                </div>
                <div className="profile-save-button-global">
                  <button
                    onClick={() => save()}
                    className="profile-save-button"
                  >
                    G??ncelle
                  </button>
                </div>
              </div>
            </div>

            <div className="main-card-global">
              <div className="main-card">
                <div className="main-card-header">Tema</div>
                <div className="theme-buttons-global">
                  <div className="theme-buttons">
                    <div
                      onClick={() => {
                        themeChange("light");
                      }}
                      className={
                        profileTheme && profileTheme == "light"
                          ? "dark-button"
                          : "light-button"
                      }
                    >
                      A????k
                    </div>
                    <div
                      onClick={() => {
                        themeChange("dark");
                      }}
                      className={
                        profileTheme && profileTheme == "dark"
                          ? "dark-button"
                          : "light-button"
                      }
                    >
                      Koyu
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <SocialMedia />


              {
                accountTypePremium !==false || accoutTypeNormal !== false &&  (

                  <div className="main-card-global">
                <div className="main-card">
                  <div className="logo-hidden-area">
                    <div className="logo-hidden-text">
                      Hibrit Card logosunu gizle
                    </div>


                    {

accountFirstTwoMonth ===true && accountTypePremium===false &&  (

    <div className="logo-hidden-lock" onClick={()=> setcheckRight(!checkRight)}>
                      <div className="lock-text">
                           Y??kselt
                        </div>
                      <div className="lock-icon">
                        <i className="fa-solid fa-lock"></i>
                      </div>
                    </div>


)
                    }

                    
                    <div className="logo-hidden-checked">
                      <div className="switch-button">
                        <label
                          className="switch"
                          value={checkRight}
                          onChange={() => checkRightTis()}
                        >
                          <input type="checkbox" checked={checkRight }  onClick={()=> hideLogoTo()}/>
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>



                  </div>
                </div>
              </div>
                )
              }
            

            {/* {

accountTypeFrom === false && (

    <div className='main-card-global'>
    <div className='main-ads-card'>

        <div className='main-ads-header'>
            Hibrit Card Pro
        </div>
        <div className='main-ads-offer'>
            <p>??lk aya ??zel</p>
            <p className='main-ads-center'>%20</p>
            <p>indirimli</p>
        </div>
        <div className='main-ads-text'>
        </div>

    </div>
</div>


)


                        } */}

            <div className="main-card-global">
              <div className="account-buttons">
                <div
                  onClick={() => setDeletePopup(true)}
                  className="global-button account-delete-button"
                >
                  Profili Sil
                </div>
                {/**   <div className='button-space '></div>
                            <div onClick={() => exit()} className='global-button account-exit-button'>
                                ????k???? yap
                            </div>*/}
              </div>
            </div>
          </div>
        </div>
        <ProfilePageButton />
      </GlobalControllerLayout>
    </>
  );
}

export default View;
