from brownie import MyNFT

from scripts.brownie.helpful_scripts import get_account, update_front_end


def main():
    _ = deployMyNFT(update_front_end_flag=True)


def deployMyNFT(update_front_end_flag=True):
    print("Deploying MyNFT...")
    myNFT = MyNFT.deploy({"from": get_account()})
    print(f"Deployed MyNFT at {myNFT}...")
    if update_front_end_flag:
        update_front_end()
    return myNFT
