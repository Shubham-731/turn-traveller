import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import SearchFlight from "@/components/SearchFlights";
import { FlightTakeoff } from "@mui/icons-material";
import { useRef } from "react";
import { KeyboardArrowUp } from "@mui/icons-material";

export default function Home() {
  const [offers, setOffers] = useState([]);
  const [offersLimit, setOffersLimit] = useState(10);
  const [showScrollToTopBtn, setShowScrollToTopBtn] = useState(false);
  const offersRef = useRef(null);

  const formatOffer = (offer) => ({
    offerId: offer.id,
    ownerName: offer.owner.name,
    ownerLogo: offer.owner.logo_symbol_url,
    totalAmount: offer.total_amount,
    origin: offer.slices[0].origin.name,
    destination: offer.slices[0].destination.name,
  });

  const scrollToOffers = () => {
    offersRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchFlight = async (payload) => {
    try {
      const options = {
        slices: [
          {
            origin: payload.origin,
            destination: payload.destination,
            departure_date: payload.departureDate,
          },
        ],
        passengers: [
          {
            type: payload.passengerType,
          },
        ],
        cabin_class: payload.cabinClass,
      };

      const res = await axios.post(
        "/api/offer-requests/create",
        {
          options,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        if (Boolean(res.data.offers)) {
          const formattedOffers = res.data.offers.map((offer) =>
            formatOffer(offer)
          );
          setOffers(formattedOffers);
          scrollToOffers();
        } else {
          alert("No flights found!");
        }
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        setShowScrollToTopBtn(true);
      } else {
        setShowScrollToTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [window.pageYOffset]);

  return (
    <>
      <Head>
        <title>Search Flights</title>
      </Head>

      <main className="relative px-2 py-10 md:py-40 h-screen w-screen flex items-center flex-col gap-20">
        <div className="fixed inset-0 h-screen w-screen">
          <Image src={"/bg_home.jpg"} fill={true} alt="Book flights" />
        </div>

        {showScrollToTopBtn && (
          <Tooltip arrow title="Scroll to top">
            <button
              className="px-2 pt-2 fixed right-10 bottom-10 rounded-full bg-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-100 hover:bg-opacity-75 cursor-pointer transition-all"
              onClick={scrollToTop}
            >
              <KeyboardArrowUp />
            </button>
          </Tooltip>
        )}

        <div className="w-full">
          <SearchFlight handleSearch={handleSearchFlight} />
        </div>

        {Boolean(offers.length) && (
          <div
            className="relative max-w-5xl w-full mx-auto bg-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 border border-gray-100 p-4 rounded-md"
            ref={offersRef}
          >
            <h2 className="text-center mb-4">
              Available Flights ({offers.length})
            </h2>

            <div className="flex flex-col gap-2">
              {offers.slice(0, offersLimit).map((offer, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border border-slate-400 border-solid transition-all rounded-md hover:shadow-md"
                >
                  <div className="flex flex-col gap-0 items-center">
                    <div className="w-20 h-10 relative">
                      <Image
                        src={offer.ownerLogo}
                        alt={offer.ownerName}
                        fill={true}
                      />
                    </div>
                    <span className="text-sm">{offer.ownerName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-base">{offer.origin}</p>
                    <FlightTakeoff color="primary" />
                    <p className="text-base">{offer.destination}</p>
                  </div>

                  <p className="font-bold text-lg text-red-500">
                    ${offer.totalAmount}
                  </p>

                  <Button variant="contained" color="secondary">
                    Book Now
                  </Button>
                </div>
              ))}

              {offers.length > offersLimit && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setOffersLimit((prevLimit) => prevLimit + 10)}
                >
                  Show more results
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
