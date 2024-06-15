import { useState,useEffect,useContext } from "react";
import Web3Context from "../../context/Web3Context";
import {ethers} from "ethers";
import { toast } from "react-hot-toast";
import "./DisplayPanel.css";

const EarnedReward = () =>{
    const {stakingContract,selectedAccount} = useContext(Web3Context)
    const [rewardVal, setRewardVal] = useState("0");

    useEffect(() => {
        const fetchStakeRateInfo = async()=> {
            try{
              const rewardValueWei = await stakingContract.earned(selectedAccount);
              const rewardValueEth = ethers.formatUnits(rewardValueWei.toString(),18);
              const roundedReward = parseFloat(rewardValueEth).toFixed(2)
              setRewardVal(roundedReward)
            }catch(error){
                //console.error("Error fetching data:", error.message)
            toast.error("Error fetching the reward:");
            console.error(error.message)
            }
        }
            const interval = setInterval(() => {
                stakingContract && fetchStakeRateInfo();
            },20000)
        
        return () => clearInterval(interval);
    },[stakingContract,selectedAccount])

    return (
        <div className="earned-reward">
      <p>Earned Reward:</p>
      <span>{rewardVal}</span>
  </div>
    )

}
export default EarnedReward;