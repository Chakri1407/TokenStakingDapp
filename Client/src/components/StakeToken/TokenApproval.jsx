import {useContext,useRef } from "react";
import Button from "../Button/Button"
import {ethers} from "ethers";
import Web3Context from "../../context/Web3Context";
import { toast } from "react-hot-toast";


const TokenApproval = () => {
    const {stakeTokenContract,stakingContract} = useContext(Web3Context);
  const approvedTokenRef = useRef();
  //const [transactionStatus,setTransactionStatus] = useState("");

  const approveToken = async(e) => {
    e.preventDefault();
    const amount = approvedTokenRef.current.value.trim() ;
    if(isNaN(amount)|| amount <=0){
        toast.error("Please enter a valid positive number");
        return;
    }
    const amountToSend = ethers.parseUnits(amount,18).toString(); //console.log(amountToSend);
    try{
      const transaction = await stakeTokenContract.approve(stakingContract.target,amountToSend)
      //console.log(transaction);
      await toast.promise(transaction.wait(),
    {
      loading: "Transaction is pending...",
      success: 'Transaction successful 👍👍',
      error: 'Transaction failed 👎👎'
    });
    approvedTokenRef.current.value = "";
      // setTransactionStatus("Transaction is in pending...")
      // const receipt = await transaction.wait();
      // if(receipt.status ===1){
      //   setTransactionStatus("Transaction is Succesful");
      //   setTimeout(() => {
      //       setTransactionStatus("")
      //   },5000)
      //   approvedTokenRef.current.value = ""
      // }else{
      //   setTransactionStatus("Transaction is Failed");
      // }
    }catch(error){
      toast.error("Token Approval Failed");
      console.error(error.message)
    }
    
  } /*{transactionStatus && <div> {transactionStatus} </div> }*/ //enter it in return while oding original 
    return (
        <div>
            
            <form onSubmit={approveToken} className="token-amount-form">  
                <label className="token-input-label"> Token Approval: </label>
                <input type="text" ref = {approvedTokenRef} ></input>
                <Button onClick={approveToken}  type="submit" label="Token Approval"/>   
            </form>
          </div>
    )

}

export default TokenApproval