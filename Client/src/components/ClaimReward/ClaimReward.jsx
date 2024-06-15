import { useContext } from "react"; //Add useState, useRef
import Button from "../Button/Button"
import Web3Context from "../../context/Web3Context";
import { toast } from "react-hot-toast";
import "./ClaimReward.css"

const ClaimReward = () => {
    //const [transactionStatus,setTransactionStatus] = useState("");
    const {stakingContract} = useContext(Web3Context);
  const claimReward = async() => {
    try{
      const transaction = await stakingContract.getReward();
      //const receipt = await transaction.wait();
      await toast.promise(transaction.wait(),
    {
      loading: "Transaction is pending...",
      success: 'Transaction successful 👌',
      error: 'Transaction failed 🤯'
    });
      // setTransactionStatus("Transaction is in pending...")
      // if(receipt.status ===1){
      //   setTransactionStatus("Transaction is Succesful");
      //   setTimeout(() => {
      //       setTransactionStatus("")
      //   },5000)
      // }else{
      //   setTransactionStatus("Transaction is Failed, please try again");
      // }
    }catch(error){
        console.error("Claim reward failed", error.message);
    }
    
  } // {transactionStatus && <div> {transactionStatus} </div> } add below in return 
    return (
      <>
      <div className="claim-reward">
       <Button type="button" label="Claim Reward" onClick={claimReward}/>
       </div>
      </>
    )
}

export default ClaimReward