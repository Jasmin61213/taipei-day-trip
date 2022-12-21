TPDirect.setupSDK(
    126879, 
    "app_oQgq2q04QdjJbft6HC5LzE9iospyjsD6ujThdjs8It3MEFsLKXGaWiOpOaaF", 
    "sandbox"
    )

let fields = {
    number: {
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        'input': {
            'color': 'gray'
        },
        'input.ccv': {
        },
        'input.expiration-date': {
        },
        'input.card-number': {
        },
        ':focus': {
            'color': "black"
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

function onSubmit() {
    const payName = document.getElementById("name").value
    const payEmail = document.getElementById("email").value
    const payPhone = document.getElementById("phone").value
    const emailRegex = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
    const phoneRegex = new RegExp(/^09[0-9]{8}$/)
    //判斷是否輸入有效的聯絡資訊
    if (emailRegex.test(payEmail) == false){
        showRemind("請輸入有效的信箱")
    }
    if (phoneRegex.test(payPhone) == false){
        showRemind("請輸入有效的手機")
    }
    if (emailRegex.test(payEmail) == false || phoneRegex.test(payPhone) == false){
        showRemind("請輸入正確的聯絡資訊")
    }
    else{
        // 取得 TapPay Fields 的 status
        const tappayStatus = TPDirect.card.getTappayFieldsStatus()

        // 確認是否可以 getPrime
        if (tappayStatus.canGetPrime === false) {
            showRemind("請輸入正確的信用卡資訊")
            return
        }
        // Get prime
        payData = {}
        TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
                showRemind("請輸入正確的信用卡資訊")
                return
            }
            const prime = result.card.prime
            payData = {
                "prime" : prime,
                "name" : payName,
                "email" : payEmail,
                "phone" : payPhone
            }
            order(payData)
        })
    }
}

function order(payData){
    fetch("/api/orders",{
        method: "POST",
        body: JSON.stringify(payData),
        cache: "no-cache",
        headers:{
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        }  
    })
    .then(function(response){
        res = response
        return response.json();
    })
    .then(function(data){
        if (res.status == 200){
            message = data.data.data.payment.message
            orderID = data.data.data.number
            showRemind(message)
            setTimeout(function () {
                thankyouUrl = "/thankyou?number="+orderID;
                window.location.href = thankyouUrl;
              }, 1.5 * 1000); 
        }
        if (res.status == 400){
            message = data.data.data.payment.message
            showRemind(message)
        }
    })
}