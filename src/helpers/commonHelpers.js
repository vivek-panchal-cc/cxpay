const getChargedAmount = (charges = [], amounts = []) => {
  if (!charges || amounts.length <= 0)
    return { allCharges: [], grandTotal: 0, total: 0 };
  const total = amounts.reduce((prev, curr) => prev + curr, 0);
  let allCharges = [],
    grandTotal = total;
  allCharges = charges.map((item) => {
    const { type = "", amount = 0, text = "" } = item;
    const thisCharge = { desc: "", amount: 0 };
    switch (type) {
      case "fixed":
        thisCharge.amount = total <= 0 ? 0 : amount * amounts.length;
        thisCharge.desc = text;
        break;
      case "percentage":
        const deduct = total * (amount / 100);
        thisCharge.amount = deduct;
        thisCharge.desc = text;
        break;
    }
    grandTotal += thisCharge.amount;
    return thisCharge;
  });
  return {
    allCharges,
    grandTotal,
    total,
  };
};

export { getChargedAmount };
