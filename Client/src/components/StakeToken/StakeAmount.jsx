import { useContext, useRef } from "react";
import Button from "../Button/Button";
import { ethers } from "ethers";
import Web3Context from "../../context/Web3Context";
import StakingContext from "../../context/StakingContext";
import { toast } from "react-hot-toast";
import "./StakeAmount.css";

const StakeAmount = () => {
  //const [transactionStatus,setTransactionStatus] = useState("");//import useState
  const { stakingContract } = useContext(Web3Context);
  const { isReload, setIsReload } = useContext(StakingContext);
  const stakeAmountRef = useRef();

  const stakeToken = async (e) => {
    e.preventDefault();
    const amount = stakeAmountRef.current.value.trim();
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }
    const amountToStake = ethers.parseUnits(amount, 18).toString(); //console.log(amountToSend);
    try {
      const transaction = await stakingContract.stake(amountToStake);
      //console.log(transaction);
      await toast.promise(transaction.wait(), {
        loading: "Transaction is pending....",
        success: "Transaction is succesful 👍👍",
        error: "Transaction Failed 👎👎",
      });
      stakeAmountRef.current.value = "";
      setIsReload(!isReload);
      // setTransactionStatus("Transaction is in pending...")
      // const receipt = await transaction.wait();
      // if(receipt.status ===1){
      //   setTransactionStatus("Transaction is Succesful");
      //   setIsReload(!isReload)
      //   setTimeout(() => {
      //       setTransactionStatus("")
      //   },5000)
      //   stakeAmountRef.current.value = ""
      // }else{
      //   setTransactionStatus("Transaction is Failed");
      // }
    } catch (error) {
      toast.error("Staking failed");
      console.error(error.message);
    }
  };
  return (
    /* transactionStatus && <div> {transactionStatus} </div> */
    <form onSubmit={stakeToken} className="stake-amount-form">
      <label className="stake-input-label"> Amount To stake: </label>
      <input type="text" ref={stakeAmountRef}></input>
      <Button onClick={stakeToken} type="submit" label="Stake" />
    </form>
  );
};

export default StakeAmount;
