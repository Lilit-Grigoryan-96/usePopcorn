import { useEffect, useState } from "react";
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

export default function App() {
  const [amount, setAmount] = useState(1);
  const [fromOption, setFromOption] = useState("EUR");
  const [toOption, setToOption] = useState("USD");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //   useEffect(
  //     function () {
  //       fetch(
  //         `https://api.frankfurter.app/latest?amount=${amount}&from=${fromOption}&to=${toOption}`
  //       )
  //         .then((res) => res.json())
  //         .then((data) => setOutput(data.rates[toOption]));
  //     },
  //     [amount, fromOption, toOption]
  //   );
  useEffect(
    function () {
      async function convert() {
        setIsLoading(true);

        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromOption}&to=${toOption}`
        );
        const data = await res.json();
        setOutput(data.rates[toOption]);

        setIsLoading(false);
      }
      if (toOption === fromOption) setOutput(amount);
      convert();
    },
    [amount, fromOption, toOption]
  );
  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isLoading}
      />
      <select
        value={fromOption}
        onChange={(e) => setFromOption(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toOption}
        onChange={(e) => setToOption(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>
        {" "}
        {output} {toOption}
      </p>
    </div>
  );
}
