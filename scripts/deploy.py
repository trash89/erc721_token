from brownie import accounts, interface, MyToken


def main():
    alice = accounts[0]
    bob = accounts[1]
    luke = accounts[2]
    dan = accounts[3]
    print("Deploying MyToken...")
    mt = MyToken.deploy({"from": alice})
    print(f"Deployed MyToken at {mt}...")

    print("Safe Mint NFT 1 to alice...")
    tx = mt.safeMint(alice.address, 1, {"from": alice})
    tx.wait(1)
    # print_events(tx)
    print("Safe Minted NFT 1 to alice")
    print_balances(alice, bob)
    print(f"Owner of NFT 1 is {mt.ownerOf(1)}")

    print("Transfer the NFT 1 from alice to bob...")
    tx = mt.safeTransferFrom(alice.address, bob.address, 1, {"from": alice})
    tx.wait(1)
    # print_events(tx)
    print("Safe transferred NFT 1 from alice to bob")
    print(f"Owner of NFT 1 is {mt.ownerOf(1)}")
    print_balances(alice, bob)

    print("Bob give the permission to Luke to transfer NFT 1 to another account")
    tx = mt.approve(luke.address, 1, {"from": bob})
    tx.wait(1)
    print(f"Ok Bob give the permission to {mt.getApproved(1)}")

    print("Now Luke can transfer BOB's NFT 1 to Dan..")
    tx = mt.safeTransferFrom(bob.address, dan.address, 1, {"from": luke})
    tx.wait(1)
    print(f"Now, the NFT 1 belongs to Dan..{mt.ownerOf(1)}")

    print("Now, Dan burns the NFT 1...")
    tx = mt.burn(1, {"from": dan})
    tx.wait(1)
    print_balances(alice, bob)


def print_balances(_alice, _bob):
    mt = MyToken[-1]
    print(f"Alice balance is {mt.balanceOf(_alice)}")
    print(f"Bob balance is {mt.balanceOf(_bob)}")


def print_events(_tx):
    print(_tx.call_trace())
    print(_tx.events)
