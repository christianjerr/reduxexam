import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as model from "../../redux/models";
import * as actions from "../../redux/actions";
import { itemRes } from "../../redux/selectors";

const Main = () => {
  const [initialStates, setInitialStates] = useState("");
  const [initialCountry, setInitialCountry] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.getItem.request({}));
  }, [dispatch]);

  const initial = useSelector((state: model.InitialStateTypes) =>
    itemRes(state)
  );

  const handleStateChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setInitialStates("");
      setInitialStates(e.target.value);
    },
    []
  );

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setInitialCountry("");
      setInitialStates("");
      setInitialCountry(e.target.value);
    },
    []
  );

  const memoizeCountries = useMemo(() => {
    return (
      <select
        onChange={handleCountryChange}
        className="w-30 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option disabled selected>
          Select Country
        </option>
        {initial.map((item) => (
          <option key={item.id}>{item.name}</option>
        ))}
      </select>
    );
  }, [handleCountryChange, initial]);

  const memoizeState = useMemo(() => {
    const selectedStates: string[] = [];
    const selectedCountry = initial.filter(
      (item) => item.name === initialCountry
    );

    selectedCountry[0]?.states.forEach((country) =>
      selectedStates.push(country.name)
    );

    selectedStates.unshift("Select States");

    return (
      <select
        onChange={handleStateChange}
        className="w-30 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {selectedStates.map((item) => {
          return <option key={item}>{item}</option>;
        })}
      </select>
    );
  }, [handleStateChange, initial, initialCountry]);

  const memoizedCities = useMemo(() => {
    const selectedCountry = initial.filter(
      (item) => item.name === initialCountry
    );

    const selectedStates = selectedCountry[0]?.states.filter(
      (item) => item.name === initialStates
    );

    return (
      <ul className="grid grid-cols-2 gap-10 md:gap-20 md:grid-cols-4 text-gray-50">
        {selectedStates &&
          selectedStates[0]?.cities.map((ci) => (
            <div
              key={ci.name}
              className="bg-sky-500 p-2 rounded-lg color-white md:p-5"
            >
              <li className="text-xl md:text-3xl">{ci.name}</li>
              <br />
              <li>
                {ci.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </li>
              <li>Citizens</li>
              <br />
            </div>
          ))}
      </ul>
    );
  }, [initial, initialCountry, initialStates]);

  const memoizeTotalCitizens = useMemo(() => {
    const selectedCountry = initial.filter(
      (item) => item.name === initialCountry
    );

    const cities = selectedCountry[0]?.states.filter(
      (state) => state.name === initialStates
    )[0]?.cities;

    var sum = cities?.reduce((a: any, b: any) => {
      return a + b.population;
    }, 0);
    return sum;
  }, [initial, initialCountry, initialStates]);

  const memoizeHomePage = useMemo(() => {
    return initialCountry && initialStates ? (
      <>
        <p className="text-2xl">
          Total Citizen:{" "}
          {memoizeTotalCitizens
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="text-2xl text-left pb-10">Cities: </p>
        {memoizedCities}
      </>
    ) : (
      <div className="bg-indigo-500 text-center m-auto w-80 p-2 text-white">
        <p>Please choose country and states</p>
      </div>
    );
  }, [initialCountry, initialStates, memoizeTotalCitizens, memoizedCities]);

  return (
    <div className="p-10">
      <div className="grid grid-cols-2 gap-20 pb-20">
        {memoizeCountries}
        {memoizeState}
      </div>
      {memoizeHomePage}
    </div>
  );
};
export default Main;
