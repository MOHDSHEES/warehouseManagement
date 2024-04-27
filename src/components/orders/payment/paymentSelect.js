import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { FormHelperText } from "@mui/joy";

const options = [
  { value: "Online", label: "Online", icon: <CreditCardIcon /> },
  { value: "Cash", label: "Cash", icon: <AttachMoneyIcon /> },
  { value: "Pay Later", label: "Pay Later", icon: <ScheduleIcon /> },
];

function renderValue(option) {
  if (!option) {
    return null;
  }

  return (
    <React.Fragment>
      <ListItemDecorator>
        {/* <Avatar size="sm" src={options.find((o) => o.value === option.value)?.icon} /> */}
        <Avatar size="sm">
          {options.find((o) => o.value === option.value)?.icon}
        </Avatar>
      </ListItemDecorator>
      {option.label}
    </React.Fragment>
  );
}

export default function PaymentSelect({ payment, setPayment }) {
  return (
    <FormControl>
      <FormLabel id="payment-select" htmlFor="payment-select-btn">
        Payment Method
      </FormLabel>
      <Select
        // defaultValue="1"
        name="paymentMethod"
        size="lg"
        slotProps={{
          listbox: {
            sx: {
              "--ListItemDecorator-size": "44px",
            },
          },
          button: {
            id: "payment-select-btn",
            // TODO: Material UI set aria-labelledby correctly & automatically
            // but Base UI and Joy UI don't yet.
            "aria-labelledby": "payment-select payment-select-btn",
          },
        }}
        value={payment.paymentMethod}
        onChange={(e, value) => {
          setPayment({ ...payment, paymentMethod: value });
        }}
        sx={{
          "--ListItemDecorator-size": "44px",
          minWidth: 240,
        }}
        renderValue={renderValue}
      >
        {options.map((option, index) => (
          <React.Fragment key={option.value}>
            {/* {index !== 0 ? (
              <ListDivider role="none" inset="startContent" />
            ) : null} */}
            <Option value={option.value} label={option.label}>
              <ListItemDecorator>
                <Avatar size="sm">{option.icon}</Avatar>
              </ListItemDecorator>
              {option.label}
            </Option>
          </React.Fragment>
        ))}
      </Select>
    </FormControl>
  );
}
