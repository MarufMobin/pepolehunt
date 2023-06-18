import { navigate } from "@reach/router";
import React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;
const Distroy = () => {
  const deleteHandler = (e) => {
    console.log(e);
    try {
      fetch(`http://localhost:5000/api/v1/users/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          id: e,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            return navigate("/distroy");
          }
        });
    } catch (err) {
      console.error(err.massage);
    }
  };

  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    try {
      fetch(`http://localhost:5000/api/v1/users`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setUsersData(data.data));
    } catch (err) {
      console.error(err.massage);
    }
  }, []);
  console.log(usersData);

  return (
    <div className="container">
      <div className="row">
        {usersData?.map((userdatas, index) => (
          <div className="col-md-3" key={index}>
            <div className="nft__item m-0 mb-5" key={index}>
              <div className="author_list_pp">
                <img className="lazy" src={userdatas?.image} alt="" />
                <i className="fa fa-check"></i>
              </div>

              <Outer>
                <span>
                  <img
                    src={userdatas?.image}
                    className="lazy nft__item_preview"
                    alt=""
                  />
                </span>
              </Outer>
              <div className="spacer-10"></div>
              <div className="spacer-10"></div>

              <div className="nft__item_price">
                <div className="nft__item_price ">
                  {userdatas?.name ? `Name: ${userdatas?.name}` : ""}
                </div>

                <div className="nft__item_price py-1">
                  {userdatas?.gender ? `Gender: ${userdatas.gender}` : ""}
                </div>

                <div className="nft__item_price pb-1">
                  {userdatas?.age ? `Age: ${userdatas.age}` : ""}
                </div>

                <div className="nft__item_price">
                  {userdatas?.number ? `Number: ${userdatas.number}` : ""}
                </div>
                <div className="nft__item_price py-2">
                  {userdatas?.address ? `Address: ${userdatas.address}` : ""}
                </div>
                <div className="p-0">
                  {!userdatas?.success && (
                    <div className="nft__item_action p-0">
                      <button
                        onClick={(e) => deleteHandler(userdatas?._id)}
                        className="btn-danger "
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Distroy;
