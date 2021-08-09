import * as React from "react";
import { useSelector } from "react-redux";
import Api from "../Api";

const OrderPrint = React.forwardRef<HTMLDivElement>((props, ref) => {
  const { mt_store } = useSelector((state: any) => state.login);
  const { order, product, store } = useSelector((state: any) => state.orderDetail);

  console.log("selector order", order);
  console.log("selector product", product);
  console.log("selector store", store);

  const value = {
    basicDetails: {
      firstName: "John ",
      lastName: "Doe",
      jobTitle: "Software Engineer",
      email: "test@test.com",
      phoneNumber: "(912) 555-4321",
      website: "hjasfjhdashjds@adsa.com",
      location: "Texas, USA",
    },
    careerProfile: {
      profileDesc:
        "Richard hails from Tulsa. He has earned degrees from the University of Oklahoma and Stanford. (Go Sooners and Cardinals!) Before starting Pied Piper, he worked for Hooli as a part time software developer. While his work focuses on applied information theory, mostly optimizing lossless compression schema of both the length-limited and adaptive variants, his non-work interests range widely, everything from quantum computing to chaos theory.",
    },
    skills: [
      {
        skillName: "HTML",
        skillLevel: "2",
      },
      {
        skillName: "CSS",
        skillLevel: "4",
      },
      {
        skillName: "JS",
        skillLevel: "3",
      },
    ],
    companyDetails: [
      {
        companyName: "LMN",
        designation: "Software Engineer",
        empStartDate: "04/2018",
        empEndDate: "02/2019",
        employmentDetail:
          "<p>Responsible for building websites and web based applications and to coordinate with team.</p>\n",
      },
    ],
    education: [
      {
        qualification: "BE",
        institution: "XYZ",
        eduStartDate: "04/2016",
        eduEndDate: "04/2020",
        educationDetail: "<p>Specialization in Civil Engineering</p>\n",
      },
      {
        qualification: "HSC",
        institution: "ABC",
        educationDetail: "<p>Higher Secondary Education</p>\n",
        eduStartDate: "04/2014",
        eduEndDate: "03/2016",
      },
    ],
  };

  return mt_store && order && product && store ? (
    <div ref={ref}>
      <div className="a4-screen-sized">
        <div className="aspect-ratio-box rounded-lg overflow-hidden">
          <div className="aspect-ratio-box-inside border border-gray-200 rounded-lg overflow-hidden">
            <div className="w-full object-cover object-center p-5 bg-gray-100">
              <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3 uppercase">
                {mt_store}
              </h1>
              <p style={{ color: "rgb(255, 179, 62)", marginBottom: 0 }}>
                주문내역 상세
              </p>
            </div>
            <div className="bg-gray-200 flex flex-wrap w-full p-5">
              <div className="w-full">
                <h2 className="text-md bold title-font text-gray-500 tracking-widest mb-4">
                  주문매장
                </h2>
                <div className="flex flex-wrap mb-4">
                  <div className="w-full">
                    <div className="flex">
                      <span className="w-20 text-sm">상호명 :</span>
                      <p className="text-sm">{store.mb_company}</p>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-sm">주문시간 :</span>
                      <p className="text-sm">{order.od_time}</p>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-sm">주문방법 :</span>
                      <p className="text-sm">{order.od_type}</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-md bold title-font text-gray-500 tracking-widest mb-4">
                  메뉴정보
                </h2>
                {product.map((item: any, index: number) => (
                  <div className="flex flex-wrap mb-4" key={index}>
                    <div className="w-full">
                      <p className="text-sm">
                        메뉴 : {item.it_name} / 옵션 - {item.ct_option}
                      </p>
                    </div>
                  </div>
                ))}

                <h2 className="text-md bold title-font text-gray-500 tracking-widest mb-4">
                  요청사항
                </h2>
                <div className="flex flex-wrap mb-4">
                  <div className="w-full">
                    <div className="flex">
                      <span className="w-20 text-sm">사장님께 :</span>
                      <p className="text-sm">
                        {order.order_seller
                          ? order.order_seller
                          : "요청사항이 없습니다."}
                      </p>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-sm">기사님께 :</span>
                      <p className="text-sm">
                        {order.order_officer
                          ? order.order_officer
                          : "요청사항이 없습니다."}
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-md bold title-font text-gray-500 tracking-widest mb-4">
                  배달정보
                </h2>
                <div className="flex flex-wrap mb-4">
                  <div className="w-full">
                    <div className="flex">
                      <span className="w-20 text-sm">배달주소 :</span>
                      <p className="text-sm">
                        {order.order_addr1} {order.order_addr3}
                      </p>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-sm">전화번호 :</span>
                      <p className="text-sm">
                        {Api.phoneFomatter(order.order_hp)}
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-md bold title-font text-gray-500 tracking-widest mb-4">
                  결제정보
                </h2>
                <div className="flex flex-wrap mb-4">
                  <div className="w-full">
                    <div className="flex">
                      <span className="w-20 text-sm">총 주문금액 :</span>
                      <p className="text-sm">
                        {Api.comma(order.odder_cart_price)} 원
                      </p>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-sm">배달팁 :</span>
                      <p className="text-sm">
                        {Api.comma(order.order_cost)} 원
                      </p>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-sm">포인트 :</span>
                      <p className="text-sm">
                        {Api.comma(order.order_point)} P
                      </p>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-sm">쿠폰할인 :</span>
                      <p className="text-sm">
                        {Api.comma(order.order_coupon)} 원
                      </p>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-sm">총 결제금액 :</span>
                      <p className="text-sm">
                        {Api.comma(order.order_sumprice)} 원
                      </p>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-sm">결제방법 :</span>
                      <p className="text-sm">{order.od_settle_case}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
});

export default OrderPrint;
