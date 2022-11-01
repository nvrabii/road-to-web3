const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let coffeeFund;

async function app() {
  resetForm();

  const { provider, signer } = await connectWallet();
  const contractAbi = await getAbi("/contracts/CoffeeFund.json");

  if (provider && signer) {
    switchView();
    coffeeFund = new ethers.Contract(contractAddress, contractAbi, signer);
    await loadMemos(provider);
    addListeners();
  } else {
    console.log("oopfs");
  }
}

async function getAbi(url) {
  let abi;

  await axios
    .get(url)
    .then(({ data }) => {
      abi = data.abi;
    })
    .catch((e) => {
      console.log(e);
    });

  return JSON.stringify(abi);
}

async function connectWallet() {
  try {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log(
      `Wallet connected. Signer address: ${await signer.getAddress()}`
    );
    return { provider, signer };
  } catch (e) {
    console.log(e);
    console.log("Could not connect the Wallet");
  }

  return {};
}

async function loadMemos() {
  try {
    const memos = await coffeeFund.getMemos();
    const memosHeader = document.querySelector(".memos__header");
    const memosList = document.querySelector(".memos__list");

    function renderMemo(memo) {
      const { amount, from, message } = memo;

      return `<div class="memo">
                <div class="memo__title">
                  <b>${from}</b> donated <b>${ethers.utils.formatEther(
        amount
      )}ETH</b> for coffee
                </div>
                <div class="memo__body">"${message}"</div>
              </div>`;
    }

    memosHeader.innerHTML = "No memos yet";
    memosList.innerHTML = "";

    if (memos.length > 0) {
      memosHeader.innerHTML = "They took care of my caffeine intake:";
      memos.map((memo) => {
        memosList.innerHTML += renderMemo(memo);
      });
    }
  } catch (e) {
    console.log(e);
  }
}

async function sendFunds(ether, from, message) {
  try {
    const tx = await coffeeFund.buyCoffee(from, message, {
      value: ether,
    });
    await tx.wait();
    console.log(`${ether}ETH sent from ${from}: '${message}'`);
    resetForm();
    await loadMemos();
  } catch (e) {
    console.log(e);
  }
}

function addListeners() {
  document.querySelector("form").addEventListener("submit", handleFormSubmit);
}

function resetForm() {
  const fromInput = document.querySelector("[name='from']");
  const messageInput = document.querySelector("[name='message']");
  const options = Array.from(document.querySelectorAll("[name='amount']"));
  const firstOption = options.find((opt) => opt.id === "radio-1");

  fromInput.value = "";
  messageInput.value = "";
  options.map((option) => {
    option.checked = false;
  });
  firstOption.checked = true;
}

async function handleFormSubmit(e) {
  const amount =
    Array.from(document.querySelectorAll('input[name="amount"]'))
      .map((el) => ({
        checked: el.checked,
        value: parseInt(el.value),
      }))
      .find(({ checked }) => checked).value * 0.01;
  const from = document.querySelector("input[name='from']").value;
  const message = document.querySelector("input[name='message']").value;

  sendFunds(ethers.utils.parseEther(amount.toString()), from, message);

  e.preventDefault();
}

function switchView() {
  const notLoggedInElement = document.querySelector(".not-logged-in");
  const loggedInElement = document.querySelector(".logged-in");

  if (notLoggedInElement.hasAttribute("hidden")) {
    notLoggedInElement.removeAttribute("hidden");
    loggedInElement.setAttribute("hidden", true);
  } else {
    notLoggedInElement.setAttribute("hidden", true);
    loggedInElement.removeAttribute("hidden");
  }
}

app();
