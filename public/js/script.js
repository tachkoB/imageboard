(function() {
    new Vue({
        el: ".main",
        data: {
            cards: [],
            title: "",
            description: "",
            username: "",
            file: null,
            modalBox: false,
            showButton: true,
            image_id: location.hash.slice(1)
            //modalbox: location.hash.slice(1) for part 4
        },

        mounted: function() {
            var self = this;
            axios
                .get("/images")
                .then(function(res) {
                    console.log(
                        "!!!this is where I should find the id ",
                        res.data
                    );
                    self.cards = res.data;
                })
                .catch(function(err) {
                    console.log("err in get img", err);
                });
            addEventListener("hashchange", function() {
                self.image_id = location.hash.slice(1);
            });
        },
        methods: {
            getMoreResults: function() {
                console.log(this);
                console.log(this.cards);
                console.log(this.cards.length - 1);
                var getMoreImages = this.cards[this.cards.length - 1].id;
                console.log("jel to toooooo", getMoreImages);
                axios.get("/getMoreImages/" + getMoreImages).then(results => {
                    console.log(results.data);
                    console.log("ovo mi triba ", results.data.rows.length);
                    this.cards = this.cards.concat(results.data.rows);
                    let n = results.data.length - 1;
                    if (results.data.rows[n].id == results.data[n].lowestId) {
                        console.log(this.showButton);
                        this.showButton = false;
                    }
                });
            },
            // close: function() {
            //     this.modalBox = null;
            // },
            // showModal: function(id) {
            //     console.log(id);
            //     this.modalBox = id;
            // },
            clicked: function(id) {
                this.modalBox = id;
            },
            closeModal: function() {
                this.image_id = null;
                location.hash = "";
                history.replaceState(null, null, " ");
            },
            handleClick: function() {
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(results => {
                        console.log("response from POSt upload: ", results);
                        results = results.data.data;
                        this.cards.unshift({
                            created_at: results.created_at,
                            description: results.description,
                            title: results.title,
                            username: results.username,
                            url: results.url
                        });
                    })
                    .catch(function(err) {
                        console.log("err in post upload: ", err);
                    });
            },
            handleChange: function(e) {
                this.file = e.target.files[0];
            }
            // clicked: function(e) {
            //     let id = e.target.id;
            //     this.showCurrentImage = id;
            //     axios.get(`/getDataForModal/${{ id }}`);
            // }
        }
    });
})();
