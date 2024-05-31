import { useEffect, useMemo, useCallback } from "react";
import { FaUser, FaUpload } from "react-icons/fa";
import { useDistributionContext } from "../contexts/DistributionContext";

const ContactForm = ({ onNextButtonClick1 }) => {
  const { selectedOption, setSelectedOption, setCost } =
    useDistributionContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    onNextButtonClick1();
  };

  const costMap = useMemo(() => {
    return {
      imcwirePr: 120,
      ownPr: 0,
    };
  }, []);

  const handleOptionChange = useCallback(
    (option) => {
      setSelectedOption(option);
      setCost(costMap[option]);
    },
    [setSelectedOption, setCost, costMap]
  );

  useEffect(() => {
    setCost(costMap[selectedOption]);
  }, [selectedOption, setCost, costMap]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md border border-1">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Your Press Distribution
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-5">
          <div className="mb-2">
            <span className="font-bold"> Note: </span> We appreciate your
            high-quality Press Release. Submit it below for consideration. Share
            professionally written content. Upload now to reach a wider
            audience.
          </div>
          <div
            className={`border-2 p-2 mb-5 rounded ${
              selectedOption === "imcwirePr"
                ? "btn-grad text-start"
                : "bg-white text-black border-gray-500"
            }`}
          >
            <input
              type="radio"
              name="options"
              value="UploadFromOurself"
              checked={selectedOption === "imcwirePr"}
              onChange={() => handleOptionChange("imcwirePr")}
              className="hidden"
              id="uploadFromOurselves"
            />
            <label
              htmlFor="uploadFromOurselves"
              className="flex items-center cursor-pointer"
            >
              <FaUser size={50} className="mr-2" />
              <div>
                <span className="text-xl font-bold">
                  Write & Publication - $120
                </span>
                <br />
                <span className="text-sm text-opacity-70">
                  Our professional journalists will research and write your
                  release
                </span>
              </div>
            </label>
          </div>

          <div></div>
          <div
            className={`border-2 p-2 rounded ${
              selectedOption === "ownPr"
                ? "btn-grad"
                : "bg-white text-black border-gray-500"
            }`}
          >
            <input
              type="radio"
              name="options"
              value="UploadFromYourself"
              checked={selectedOption === "ownPr"}
              onChange={() => handleOptionChange("ownPr")}
              className="hidden"
              id="uploadByYourself"
            />
            <label
              htmlFor="uploadByYourself"
              className="flex items-center cursor-pointer"
            >
              <FaUpload size={50} className="mr-3" />
              <div>
                <span className="text-xl font-bold">
                  Upload Your PR in doc file
                </span>
                <br />
                <span>
                  Upload Your High Quality Journalists writing PR in Document.
                </span>
              </div>
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-grad py-2 px-4  uppercase text-center"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
