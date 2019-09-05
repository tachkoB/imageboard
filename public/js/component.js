(function() {
    Vue.component("modal-component", {
        template: "#modal-template",
        data: function() {
            return {
                comms: [],
                url: "",
                username: "",
                title: "",
                description: "",
                created_at: "",
                users: "",
                comment: ""
                // image_id: ""
            };
        },
        props: ["id"],
        mounted: function() {
            var self = this;
            console.log("mounted");
            console.log("label:", this);
            axios
                .get(`/getDataForModal/` + self.id)
                .then(res => {
                    self.url = res.data[0].url;
                    self.username = res.data[0].username;
                    self.title = res.data[0].title;
                    self.description = res.data[0].description;
                    self.created_at = res.data[0].created_at;
                    console.log(res);
                })
                .then(function() {
                    axios.get("/getComments/" + self.id).then(res => {
                        self.comms = res.data;
                        console.log("This is the response the BEST ONE: ", res);
                    });
                })
                .catch(err => {
                    console.log(
                        "trying to get data to post on modal:",
                        err.message
                    );
                });
        },
        methods: {
            closeModal: function() {
                this.$emit("close");
            },
            handleCommentClick: function() {
                var self = this;
                console.log(self);
                axios
                    .post("/addComment", {
                        users: self.users,
                        comment: self.comment,
                        image_id: self.id
                    })
                    .then(results => {
                        console.log(
                            "response from adding comment upload yee: ",
                            results
                        );
                        self.comms.unshift({
                            created_at: results.data[0].created_at,
                            image_id: results.data[0].image_id,
                            comment: results.data[0].comment,
                            users: results.data[0].users
                        });
                    })
                    .catch(function(err) {
                        console.log("err in post upload: ", err);
                    });
            }
        },
        watch: {
            id: function() {
                var self = this;
                console.log(self.$el.id);
                console.log("mounted");
                axios
                    .get(`/getDataForModal/` + self.id)
                    .then(res => {
                        self.url = res.data[0].url;
                        self.username = res.data[0].username;
                        self.title = res.data[0].title;
                        self.description = res.data[0].description;
                        self.created_at = res.data[0].created_at;
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(
                            "trying to get data to post on modal:",
                            err.message
                        );
                    });
                axios.get("/getComments/" + self.id).then(res => {
                    self.comms = res.data;
                    console.log("This is the response the BEST ONE: ", res);
                });
            }
        }
    });
})();

//changing the pictures by clicking the arrows
//watch for changing the ID to render the next photo when arrow is clicked2

//getting rid of the hash
// methods: {
//     closeModal: function(){
//         location.hash="";
//         history.replaceState(null, null, " ");
//     }
