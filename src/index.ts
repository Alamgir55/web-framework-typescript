import { User } from "./models/User";

const user = new User({ id: 7 });

user.on("change", () => {
  console.log(user);
});

user.fetch();
