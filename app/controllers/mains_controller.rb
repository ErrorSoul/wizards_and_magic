class MainsController < ApplicationController

  def index
  end

  def photo
    result = Station.where("name ILIKE ? ", "%#{params[:search]}%")
    render json: { result: result }
  end
end
