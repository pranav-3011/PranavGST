import React from "react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import CustomDropDown from "../../Utils/UI/CustomDropDown";

const Investigation = () => {
  return (
    <div>
      Investigation
      <div>
        <InputBox
          name="username"
          label="Username"
          value={"username"}
          // onChange={...}
          isDisabled={false}
          placeholder="Enter your username"
        />
        <InputBox
          name="email"
          label="Email"
          type="email"
          value={"email"}
          // onChange={...}
          placeholder="Enter your email"
          isDisabled={true}
        />
      </div>
      <div className="flex gap-2 my-2">
        <CustomButton variant="red">Red Button</CustomButton>
        <CustomButton variant="blue">Blue Button</CustomButton>
        <CustomButton variant="green">Green Button</CustomButton>
        <CustomButton variant="yellow">Yellow Button</CustomButton>
        <CustomButton variant="secondary">Outlined Secondary</CustomButton>
      </div>
      <div>
        <CustomDropDown
          values={["Option 1", "Option 2", "Option 3"]}
          // value={selected}
        />
        <CustomDropDown
          values={[
            { value: "apple", label: "Apple" },
            { value: "banana", label: "Bananasff" },
            { value: "c", label: "c" },
            { value: "dffrffiuhfrgfhjrsfbjf", label: "dffrffiuhfrgfhjrsfbjf" },
          ]}

          // value={selected}
        />
      </div>
    </div>
  );
};

export default Investigation;
