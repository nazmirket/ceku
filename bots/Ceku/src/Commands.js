const Configs = require('../configs.json')
const Response = require('./Response')
const Service = require('./Service')

const cDate = require('./cDate')

module.exports = commands = [
   // Help
   {
      def: '/yardim',
      desc: 'Tüm komutlar hakkında bilgi verir.',
      regex: /^\/yardim$/,
      cont: false,
      props: [],
      async action() {
         return await Response.page('help')
      },
   },
   // Register as new roommate
   {
      def: '/eklebeni',
      desc: 'Yeni bir kullanıcı ekler.',
      regex: /^\/eklebeni$/,
      cont: true,
      props: [
         {
            key: 'name',
            q: 'Adın Ne?',
            error: 'Düzgün gir adını! Mesela Benim Adım Ceku.',
            validate(v) {
               const valid = v?.length > 0 && v?.match(/^[a-zA-Z]*$/g)
               if (valid) return true
               else return this.error
            },
            transform(v) {
               return v
            },
         },
         {
            key: 'isRoommate',
            q: 'Evdeki masraflara ortak mısın yoksa Emre misin? Evet:1 Hayır:2 Emre:3',
            error: 'Okuman yazman yok mu? Evet:1 Hayır:2 Emre:3',
            validate(v) {
               const valid = [1, 2, 3].includes(parseInt(v))
               if (valid) return true
               else return this.error
            },
            transform(v) {
               const answer = parseInt(v)
               if (answer === 1) return true
               if (answer === 2) return false
               if (answer === 3) return false
            },
         },
      ],
      async action(values, sender) {
         await Service.register(sender, values.name, values.isRoommate)
         return await Response.gif('welcome')
      },
   },
   // Confirm user
   {
      def: '/dogrula',
      desc: 'Kullanıcıyı doğrular.',
      regex: /^\/dogrula$/,
      cont: true,
      props: [
         {
            key: 'password',
            q: 'Kapı Şifresi?',
            error: 'Yok kardeşim yanlış girdin',
            validate(v) {
               const valid = v === Configs.Password
               if (valid) return true
               else return this.error
            },
            transform: (v) => v,
         },
      ],
      async action(values, sender) {
         await Service.confirm(sender)
         return await Response.gif('correct')
      },
   },
   // Get user list
   {
      def: '/ahali',
      desc: 'Kullanıcıların listesini gösterir.',
      regex: /^\/ahali$/,
      cont: false,
      props: [],
      protect: true,
      async action() {
         const users = await Service.users()
         return await Response.list(users, {
            head: 'Kullanıcılar:',
            foot: `Toplam ${users.length} kullanıcı var.`,
            format(u, i) {
               const no = i + 1
               const name = u.name
               const status = u.isRoommate ? '(Masraflara Ortak)' : ''
               return `${no}. ${name} ${status}`
            },
         })
      },
   },
   // Add expense
   {
      def: '/gider',
      desc: 'Yeni gider bilgisi ekler.',
      regex: /^\/gider$/,
      cont: true,
      props: [
         {
            key: 'amount',
            q: 'Gider miktarı?',
            error: 'Lütfen bir tam sayı gir güzel kardeşim. İşim gücüm var seninle uğraşamam.',
            validate(v) {
               const n = parseInt(v)
               if (Number.isInteger(n) && n > 0) return true
               else return this.error
            },
            transform: (v) => parseInt(v),
         },
         {
            key: 'label',
            q: 'Gider etiketi? (Alışveriş, Elektrik, Su, vs.)',
            error: 'Etiketi boşluk bırakmadan tek kelime olacak şekilde yaz. 20 karakteri geçmesin.',
            validate(v) {
               if (v.split(' ').length > 1) return this.error
               if (v.length > 20) return this.error
               return true
            },
            transform: (v) => v,
         },
         {
            key: 'desc',
            q: 'Ekstra olarak eklemek istediğin bir açıklama varsa yazabilirsin yoksa "-" şeklinde cevapla.',
            error: 'Çok uzun yazdın. 200 karakterden fazla yazamazsın.',
            validate(v) {
               if (v.length > 200) return this.error
               return true
            },
            transform: (v) => v,
         },
         {
            key: 'paidBySender',
            q: 'Son olarak, bu gideri sen mi ödedin? Evet/Hayır',
            error: 'Çok net bir soru sordum Evet ya da Hayır',
            validate(v) {
               if (!['Evet', 'Hayır'].includes(v)) return this.error
               return true
            },
            transform: (v) => (v === 'Evet' ? true : false),
         },
      ],
      protect: true,
      async action(values, sender) {
         const { amount, label, desc, paidBySender } = values
         await Service.expense(amount, label, desc, sender, paidBySender)
         return Response.prepared.invoice(amount, label)
      },
   },
   // Add payment
   {
      def: '/odeme',
      desc: 'Ev hesabına yapılan ödeme bilgisini ekler.',
      regex: /^\/odeme$/,
      cont: true,
      props: [
         {
            key: 'amount',
            q: 'Ne kadar ödeme yaptınız?',
            error: 'Lütfen bir tam sayı gir güzel kardeşim.',
            validate(v) {
               const n = parseInt(v)
               if (Number.isInteger(n) && n > 0) return true
               else return this.error
            },
            transform: (v) => parseInt(v),
         },
         {
            key: 'desc',
            q: 'Ekstra olarak eklemek istediğin bir açıklama varsa yazabilirsin yoksa "-" şeklinde cevapla.',
            error: 'Çok uzun yazdın. 200 karakterden fazla yazamazsın.',
            validate(v) {
               if (v.length > 200) return this.error
               return true
            },
            transform: (v) => v,
         },
      ],
      protect: true,
      async action(values, sender) {
         const { amount, desc } = values
         await Service.pay(sender, amount, desc)
         return Response.prepared.receipt(amount)
      },
   },
   // Get debt
   {
      def: '/borc',
      desc: 'Mesaj gönderen kişinin borç bilgisini gösterir.',
      regex: /^\/borc$/,
      cont: false,
      props: [],
      protect: true,
      async action(values, sender) {
         const amount = await Service.debt(sender)
         return Response.prepared.debt(amount)
      },
   },
   // Donate
   {
      def: '/bagis',
      desc: 'Ev hesabına yapılan bağış bilgisini ekler.',
      regex: /^\/bagis$/,
      cont: true,
      props: [
         {
            key: 'amount',
            q: 'Ne kadar bağış yaptınız?',
            error: 'Lütfen bir tam sayı gir güzel kardeşim.',
            validate(v) {
               const n = parseInt(v)
               if (Number.isInteger(n) && n > 0) return true
               else return this.error
            },
            transform: (v) => parseInt(v),
         },
         {
            key: 'desc',
            q: 'Bir mesajın var mı? Varsa, yazabilirsin yoksa "-" şeklinde cevapla.',
            error: 'Roman yazsaydın amk, 200 karakterden fazla yazamazsın.',
            validate(v) {
               if (v.length > 200) return this.error
               return true
            },
            transform: (v) => v,
         },
      ],
      protect: true,
      async action(values, sender) {
         const { amount, desc } = values
         await Service.donate(sender, amount, desc)
         return Response.prepared.receipt(amount)
      },
   },
   // Get payments
   {
      def: '/odemelerim',
      desc: 'Mesaj gönderen kişinin son 15 ödeme işlemini listeler.',
      regex: /^\/odemelerim$/,
      cont: false,
      props: [],
      protect: true,
      async action(values, sender) {
         const payments = await Service.payments(sender, 15) // latest 15 payments
         return Response.list(payments, {
            head: `Son ${payments.length} ödeme listen:`,
            format(p) {
               const amount = p.amount
               const date = cDate(p.createdAt)
               return `${date}, ${amount}`
            },
         })
      },
   },
   // Get donations
   {
      def: '/bagislarim',
      desc: 'Mesaj gönderen kişinin son 15 bağış işlemini listeler.',
      regex: /^\/bagislarim$/,
      cont: false,
      props: [],
      protect: true,
      async action(values, sender) {
         const { latest, total } = await Service.donations(sender, 15) // latest 15 payments
         return Response.list(latest, {
            head: `Son ${latest.length} bağış listen:`,
            foot: `Toplam ${total}₺ bağış yaptın`,
            format(d) {
               const amount = d.amount
               const date = cDate(d.createdAt)
               return `${date}, ${amount}₺`
            },
         })
      },
   },
   // Get identity of the sender
   {
      def: '/ben',
      desc: 'Mesaj atan kişinin kim olduğunu belirtir.',
      regex: /^\/ben$/,
      cont: false,
      props: [],
      async action(values, sender) {
         const me = await Service.user(sender)
         if (me)
            return Response.plain(me, {
               format: (u) => `Senin adın ${u.name}.`,
            })
         return Response.vid('unrecognized')
      },
   },
   // Get donation leaderboard
   {
      def: '/tab',
      desc: 'En çok bağış yapan 3 kişiyi ve bağış miktarlarını listeler.',
      regex: /^\/tab$/,
      cont: false,
      props: [],
      protect: true,
      async action() {
         const donations = await Service.donationLeaderBoard()
         return Response.list(donations, {
            head: 'Sizin taşşaklarınıza kurban:',
            format(d, i) {
               const no = i + 1
               const user = d.user
               const total = d.total
               return `${no}) ${user} ${total}₺`
            },
         })
      },
   },
   // Get expenses
   {
      def: '/giderler',
      desc: 'Son 15 gideri listeler.',
      regex: /^\/giderler$/,
      cont: false,
      props: [],
      protect: true,
      async action() {
         const expenses = await Service.expenses(15)
         return Response.list(expenses, {
            head: `Son ${expenses.length} giderler:`,
            format(e, i) {
               const no = i + 1
               const label = e.label
               const amount = e.amount
               const addedBy = e.addedBy
               const date = cDate(e.createdAt)
               return `${date}, ${label} ${amount}₺   (${addedBy})`
            },
         })
      },
   },
   // Get IBAN
   {
      def: '/iban',
      desc: 'Ev hesabının iban numarasını görüntüler',
      regex: /^\/iban$/,
      cont: false,
      props: [],
      protect: true,
      async action() {
         return Response.plain(`Nazmi Yılmaz \n Ziraat Bankası ${Configs.IBAN}`)
      },
   },
]
