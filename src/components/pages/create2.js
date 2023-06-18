import React, { Component, useEffect, useState } from "react";
import Clock from "../components/Clock";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import Webcam from "react-webcam";
import { useCallback, useRef } from "react"; // import useCallback
import { render } from "react-dom";
import { Navigate } from "react-router-dom";
import { useNavigate } from "@reach/router";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #403f83;
    border-bottom: solid 1px #403f83;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;
const imageMimeType = /image\/(png|jpg|jpeg)/i;

const Createpage = () => {
  // Two Image Upload Handler use state
  const [collectAndSetImage, setCollectAndSetImage] = useState("");

  const navigate = useNavigate();
  // Image Controller
  const [serverImage, setServerImage] = useState("");

  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const dataUrl = reader.result;
        setCollectAndSetImage(dataUrl);

        console.log(dataUrl.data);
        setFileDataURL(dataUrl);
        setServerImage(dataUrl);
        console.log("Converted data URL:", dataUrl);
        // You can do further processing with the data URL here
      };

      reader.readAsDataURL(file);
    }
  };

  const changeHandler = (e) => {
    const file = e.target.files[0];
    console.log(file);
    // convertToBase64(file);
    // handleFileInputChange(file);
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
  };

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  // There are Web Cam related work here
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isClickCaptureButton, setIsClickCaptureButton] = useState(false);

  // create a capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCollectAndSetImage(imageSrc); // Efficient Image Use State
    setServerImage(imageSrc);
    setImgSrc(imageSrc);

    // handleFileInputChange(imageSrc);
  }, [webcamRef]);
  const retake = () => {
    setImgSrc(null);
  };

  // Input field data
  const [name, setName] = useState("unknown");
  const [number, setNumber] = useState("unknown");
  const [age, setAge] = useState("unknown");
  const [address, setAddress] = useState("unknown");
  const [gender, setGender] = useState("unknown");

  //This is the server sending button
  const createUser = () => {
    try {
      fetch(`http://localhost:5000/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          name: name,
          address: address,
          age: age,
          number: number,
          gender: gender,
          success: "",
          image: serverImage,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            return navigate("/explore");
          }
        });
    } catch (err) {
      console.error(err.massage);
    }
  };

  return (
    <div>
      <GlobalStyles />

      <section
        className="jumbotron breadcumb no-bg"
        style={{
          backgroundImage: `url(${"./img/background/subheader.jpg"})`,
        }}
      >
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Give us Your details </h1>
                <h4 className="text-white pt-3 text-center">
                  When it comes to finding missing persons, every piece of
                  information matters.
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <h5>Upload file</h5>
                <div className="d-create-file">
                  <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>

                  <div className="browse">
                    <input
                      type="button"
                      id="get_file"
                      className="btn-main"
                      value="Browse"
                    />

                    <input
                      id="upload_file"
                      type="file"
                      // multiple
                      // onChange={(e) => changeHandler(e)}
                      onChange={(e) => handleFileChange(e)}
                    />
                  </div>
                  {/* <div className="browse pt-4">
                    <div className="container">
                      {isClickCaptureButton ? (
                        <div className="browse pt-4">
                          <div className="container">
                            {imgSrc ? (
                              <img src={imgSrc} alt="webcam" />
                            ) : (
                              <Webcam
                                height={250}
                                width={250}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                              />
                            )}

                            <div className="btn-container">
                              {imgSrc ? (
                                <button
                                  onClick={retake}
                                  className="mt-5 btn-main"
                                >
                                  Retake photo
                                </button>
                              ) : (
                                <button onClick={capture} className="btn-main">
                                  Capture photo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span onClick={() => setIsClickCaptureButton(true)}>
                          <i className="fa fa-camera fs-1"></i>
                        </span>
                      )}
                    </div>
                  </div> */}

                  {/* Set Browser or Select Image */}

                  <div className="browse pt-4">
                    <div className="container">
                      <div className="browse pt-4">
                        <div className="container">
                          {/* <img src={imgSrc} alt="webcam" /> */}
                          <Webcam
                            height={250}
                            width={250}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                          />

                          <div className="btn-container">
                            <div className="text-center">
                              <span
                                onClick={retake}
                                className="mt-5 btn-main ms-5 mb-5"
                              >
                                Retake photo
                              </span>
                              <i
                                className="fa fa-camera fs-1 ms-5"
                                onClick={capture}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="spacer-single"></div>
                <h5>Select method</h5>
                <div className="de_tab tab_methods">
                  <ul className="de_nav"></ul>

                  <div className="de_tab_content pt-3">
                    <div id="tab_opt_1">
                      <h5>Name</h5>
                      <input
                        type="text"
                        name="item_price"
                        id="item_price"
                        className="form-control"
                        placeholder="Enter Name"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="spacer-10"></div>
                <h5>Phone No</h5>
                <input
                  type="text"
                  name="item_royalties"
                  id="item_royalties"
                  className="form-control"
                  placeholder="Phone no"
                  onChange={(e) => setNumber(e.target.value)}
                />
                <div className="spacer-10"></div>
                <h5>Age</h5>
                <input
                  type="text"
                  name="item_price"
                  id="item_price"
                  className="form-control"
                  placeholder="Enter expected age"
                  onChange={(e) => setAge(e.target.value)}
                />
                <h5>Gender</h5>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  onChange={(e) => setGender(e.target.value)}
                  className="pointer"
                />{" "}
                Male
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  onChange={(e) => setGender(e.target.value)}
                  className="ms-3 cursor-pointer"
                />{" "}
                Female
                <div className="spacer-10"></div>
                <div className="spacer-10"></div>
                <div className="spacer-10"></div>
                <h5>Address</h5>
                <textarea
                  data-autoresize
                  name="item_desc"
                  id="item_desc"
                  className="form-control"
                  placeholder="Where are you stay now?"
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5>Preview item</h5>
            <div className="nft__item m-0">
              {/* Preview Image and short image working here start  */}
              {collectAndSetImage ? (
                <div>
                  <div className="author_list_pp">
                    <span>
                      <span>
                        <img
                          src={collectAndSetImage}
                          className="lazy nft__item_preview"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </span>
                    </span>
                  </div>
                  <span>
                    <img
                      src={collectAndSetImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </span>
                </div>
              ) : (
                <div>
                  <div className="author_list_pp">
                    <span>
                      <span>
                        <img
                          src="./img/author/author-1.jpg"
                          className="lazy nft__item_preview"
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </span>
                    </span>
                  </div>
                  <span>
                    <img
                      src="./img/author/author-1.jpg"
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </span>
                </div>
              )}
              {/* Preview Image and short image working here start  */}

              <div className="nft__item_info">
                <span>
                  <h4>{name && `Name : ${name}`}</h4>
                </span>
                <span>
                  <h4>{age && `Age : ${age}`}</h4>
                </span>
                <span>
                  <h4>{gender && `Gender : ${gender}`}</h4>
                </span>
                <span>
                  <h4>{number && `Number : ${number}`}</h4>
                </span>
                <div className="nft__item_price">
                  <h4>{address && `Address : ${address}`}</h4>
                </div>
                <div className="nft__item_action">
                  <input
                    type="button"
                    id="submit"
                    className="btn-main"
                    value="Create Item"
                    onClick={createUser}
                  />
                </div>
                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Createpage;
