import {Contract, ethers} from "ethers"; 
import stakingABI from "../ABI/stakingABI.json";
import stakeTokenABI from "../ABI/stakeTokenABI.json";

export const connectWallet = async() => {
    try{

        let [signer,provider,stakingContract,stakeTokenContract,chainId] = [null];
        if(window.ethereum===null){
            throw new Error("Metamask not Installed");
        }
        const accounts = await window.ethereum.request({
            method:'eth_requestAccounts'
        })

        let chainIdHex = await window.ethereum.request({
            method:'eth_chainId'
        })
        chainId = parseInt(chainIdHex,16)

        let selectedAccount = accounts[0];
        if(!selectedAccount){
            throw new Error("No ethereum Account Available");
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        const stakeTokenContractAddress = "0xbbd25806a643ed2207a6e6c39af67f26303178e7";
        const stakingContractAddress = "0xd92d606406200c5715f78b605fd29152fb31a1a8";

        stakingContract = new Contract(stakingContractAddress,stakingABI,signer);
        stakeTokenContract = new Contract(stakeTokenContractAddress,stakeTokenABI,signer);

        return {provider,selectedAccount,stakeTokenContract,stakingContract,chainId}

    }catch(error){
        console.error(error);
        throw error
    }
}