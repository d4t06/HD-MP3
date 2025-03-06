import { useEffect, useState } from "react";
type Props = {
  closeModal: () => void;
  afterSubmit?: (c: Singer) => void;
};

type Edit = {
  type: "edit";
  singer: Singer;
  index: number;
};

type Add = {
  type: "add";
  singerName?: string;
};

const initCustomer = (props: Add | Edit) => {
  if (props.type === "edit") {
    const { id, ...rest } = props.customer;
    return initCustomerObject(rest);
  }

  return initCustomerObject({
    user_email: props.userEmail,
    customer_name: props.customerName,
  });
};

const PHONE_REGEX = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

export default function AddCustomerModal({
  closeModal,
  afterSubmit,
  ...props
}: (Add | Edit) & Props) {
  const [customer, setCustomer] = useState(initCustomer(props));
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);

  const { action, isFetching } = useCustomerAction();

  const ableToSubmit = customer.customer_name && isValidPhoneNumber;

  const handleInput = (field: keyof typeof customer, value: string) => {
    setCustomer({ ...customer, [field]: value.trim() });
  };

  const handleSubmit = async () => {
    try {
      switch (props.type) {
        case "add":
          const newCustomer = await action({
            type: "add",
            data: customer,
          });

          if (newCustomer && afterSubmit) afterSubmit(newCustomer);
          break;
        case "edit":
          await action({
            type: "edit",
            data: customer,
            index: props.index,
          });
          break;
      }
    } catch (error) {
      console.log(error);
    } finally {
      closeModal();
    }
  };

  const classes = {
    inputGroup: "gap-1",
    input: "p-2 bg-[#f1f1f1] border border-black/20 rounded-lg",
    label: "text-[#3f3f3f] text-lg",
  };

  useEffect(() => {
    if (customer.phone_number) {
      const result = PHONE_REGEX.test(customer.phone_number);
      setIsValidPhoneNumber(result);
    } else setIsValidPhoneNumber(true);
  }, [customer.phone_number]);

  const title =
    props.type === "edit" ? `Edit '${props.customer.customer_name}'` : `Add customer`;

  return (
    <>
      <ModalHeader closeModal={closeModal} title={title} />

      <div className="space-y-3 pb-[40%] overflow-auto">
        <div className={classes.inputGroup}>
          <label className={classes.label}>Customer name:</label>
          <Input
            value={customer.customer_name}
            onChange={(e) => handleInput("customer_name", e.target.value)}
            placeholder="Enter name..."
            className={classes.input}
          />
        </div>

        <div className={classes.inputGroup}>
          <p className={`${classes.label} ${!isValidPhoneNumber ? "text-red-500" : ""}`}>
            Phone number:
          </p>
          <Input
            value={customer.phone_number}
            onChange={(e) => handleInput("phone_number", e.target.value)}
            className={classes.input}
          />
        </div>

        <div className={classes.inputGroup}>
          <p className={classes.label}>Address:</p>
          <Input
            value={customer.address}
            onChange={(e) => handleInput("address", e.target.value)}
            className={classes.input}
          />
        </div>
      </div>

      <div className="text-center mt-5">
        <Button
          disabled={!ableToSubmit}
          loading={isFetching}
          onClick={() => ableToSubmit && handleSubmit()}
        >
          <CheckIcon className="w-6" />
          <p className="text-white">Ok</p>
        </Button>
      </div>
    </>
  );
}
