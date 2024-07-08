import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Check from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import ChooseParty from "./chooseParty/ChooseParty";
import { Alert, Card, CardContent } from "@mui/material";
import ChooseProducts from "./selectProducts/chooseProducts";
import Payment from "./payment/payment";
import { closeMessage } from "../functions/message";
import { MyContext } from "../context";
import OrderSuccess from "./successOrder/orderSuccess";
import ChooseReturnProducts from "./selectProducts/return/chooseReturnProducts";

const steps = ["Choose Party/Customer", "Select Products", "Payment"];

export default function OrderSteps({
  value,
  setValue,
  inputValue,
  setInputValue,
  orders,
  setOrders,
  payment,
  setPayment,
  total,
  setTotal,
  clear,
  setOrderType,
  orderType,
}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const { messageApi } = React.useContext(MyContext);
  const [invoiceData, setInvoiceData] = React.useState("");

  const handleNext = () => {
    if (!(value && value.name) && activeStep === 0) {
      closeMessage(messageApi, "Party/Customer is Rquired.", "error");
    } else if (orders && orders.length == 0 && activeStep === 1) {
      closeMessage(messageApi, "Oops! No Item is Selected.", "error");
    } else setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#784af4",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#784af4",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  }));

  function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }

  QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length ? (
        <OrderSuccess invoiceData={invoiceData} handleReset={handleReset} />
      ) : (
        <React.Fragment>
          <Card sx={{ p: 2, mb: 3, mt: 4 }}>
            <CardContent sx={{ pt: 0 }}>
              {activeStep === 0 ? (
                <ChooseParty
                  value={value}
                  setValue={setValue}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  setOrderType={setOrderType}
                  orderType={orderType}
                  clear={clear}
                />
              ) : activeStep === 1 ? (
                orderType === "New Order" ? (
                  <ChooseProducts
                    value={orders}
                    setValue={setOrders}
                    total={total}
                    setTotal={setTotal}
                  />
                ) : (
                  <ChooseReturnProducts
                    value={orders}
                    setValue={setOrders}
                    total={total}
                    setTotal={setTotal}
                  />
                )
              ) : (
                //   <ChooseProducts
                //   value={orders}
                //   setValue={setOrders}
                //   total={total}
                //   setTotal={setTotal}
                // />
                <Payment
                  payment={payment}
                  setPayment={setPayment}
                  party={value}
                  order={orders}
                  total={total}
                  setActiveStep={setActiveStep}
                  clear={clear}
                  setInvoiceData={setInvoiceData}
                  orderType={orderType}
                />
              )}
            </CardContent>
          </Card>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button onClick={handleNext}>
              {activeStep !== steps.length - 1 && "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
