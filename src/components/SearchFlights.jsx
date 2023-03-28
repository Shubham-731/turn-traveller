import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import dayjs from "dayjs";

const SearchFlights = ({ handleSearch }) => {
  const [origin, setOrigin] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);

  const [destination, setDestination] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const getSuggestions = async (query) => {
    try {
      const res = await axios.post(
        "/api/suggest-places",
        { query },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        return res.data.suggestions;
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      origin: "",
      destination: "",
      departureDate: new Date(Date.now()).toISOString().slice(0, 10),
      passengerType: "adult",
      cabinClass: "economy",
    },
    onSubmit: async (values, actions) => {
      await handleSearch(values);
      actions.setSubmitting(false);
    },
  });

  // Get suggestions for origin
  useEffect(() => {
    const fetchOriginSuggestions = async () => {
      const originSggs = await getSuggestions(origin);
      const data = originSggs.data.map((sggs) => ({
        label: `${sggs.name} (${sggs.iata_code})`,
        value: sggs.iata_code,
      }));
      setOriginSuggestions(data);
    };

    if (origin) {
      fetchOriginSuggestions();
    }
  }, [origin]);

  // Get suggestions for destinatioin
  useEffect(() => {
    const fetchDestinationSuggestions = async () => {
      const destSggs = await getSuggestions(destination);
      const data = destSggs.data.map((sggs) => ({
        label: `${sggs.name} (${sggs.iata_code})`,
        value: sggs.iata_code,
      }));
      setDestinationSuggestions(data);
    };

    if (destination) {
      fetchDestinationSuggestions();
    }
  }, [destination]);

  return (
    <div className="bg-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-100 relative w-fit mx-auto p-4 rounded-md">
      <h2 className="text-xl md:text-3xl text-center mb-4">Turn Traveller</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-3">
        <div className="flex gap-3 items-center flex-wrap">
          <Autocomplete
            options={originSuggestions}
            onChange={(e, val) => formik.setFieldValue("origin", val?.value)}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Origin"
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
            )}
          />
          <Autocomplete
            options={destinationSuggestions}
            onChange={(e, val) =>
              formik.setFieldValue("destination", val?.value)
            }
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination"
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            )}
          />
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="us">
            <DatePicker
              disablePast
              label="Departure Date"
              sx={{ width: 300 }}
              name="departureDate"
              value={dayjs(formik.values.departureDate)}
              onChange={(newValue) => {
                const date = new Date(newValue?.$d).toISOString().slice(0, 10);
                formik.setFieldValue("departureDate", date);
              }}
            />
          </LocalizationProvider>

          <FormControl sx={{ width: 300 }}>
            <InputLabel id="select-passenger-type-label">
              Passenger type *
            </InputLabel>
            <Select
              labelId="select-passenger-type-label"
              id="select-passenger-type"
              label="Passenger type *"
              name="passengerType"
              value={formik.values.passengerType}
              onChange={formik.handleChange}
              required
            >
              <MenuItem value={"adult"}>Adult</MenuItem>
              <MenuItem value={"child"}>Child</MenuItem>
              <MenuItem value={"infant_without_seat"}>Infant</MenuItem>
            </Select>
          </FormControl>
        </div>
        <FormControl
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem 0.5rem",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <FormLabel id="demo-radio-buttons-group-label">Cabin class</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="economy"
            name="cabinClass"
            value={formik.values.cabinClass}
            onChange={formik.handleChange}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            <FormControlLabel value="first" control={<Radio />} label="First" />
            <FormControlLabel
              value="business"
              control={<Radio />}
              label="Business"
            />
            <FormControlLabel
              value="premium_economy"
              control={<Radio />}
              label="Premium Economy"
            />
            <FormControlLabel
              value="economy"
              control={<Radio />}
              label="Economy"
            />
          </RadioGroup>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          sx={{ display: "block", ml: "auto" }}
        >
          {formik.isValidating === false && formik.isSubmitting === true ? (
            <CircularProgress sx={{ color: "white" }} size={20} />
          ) : (
            "Search Flights"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SearchFlights;
