class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  belongs_to :category, optional: true

  has_many :magic_lists, inverse_of: :user
  has_many :magics, through: :magic_lists
end
