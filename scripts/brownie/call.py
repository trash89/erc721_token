from brownie import accounts, Greeter
from scripts.brownie.deploy import deployGreeter


def main():
    greeter = deployGreeter()
    print("Calling Greeter contract...")
    print(greeter.greet())
    tx = greeter.setGreeting("Call from brownie script", {"from": accounts[0]})
    tx.wait(1)
    print(greeter.greet())
