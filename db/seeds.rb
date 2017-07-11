
%w[wizard mag healer warlock].each do |name|
  Category.create name: name
end

category_all = Category.all

user = User.create(
  first_name: 'John',
  last_name: 'Smith',
  role: 'admin',
  category_id: category_all.sample.id,
  email: 'admin@admin.ru',
  password: 'password'
)

stations = YAML.load_file('config/stations.yml')



Station.transaction do
  stations.each do |station|
    Station.create! name: station
  end
end


Magic.transaction do
  [
    "cнятие сглаза",
    "cнятие порчи",
    "гадание по кофейной гуще",
    "гадание таро",
    "любовная магия",
    "очищение кармы",
    "cнятие проклятия",
    "cнятие венца безбрачия"
  ].each do |magic|
    Magic.create! name: magic
 end
end
