class Admin::MagicsController < Admin::BaseController
  before_action :set_magic, only: [:show, :edit, :update, :destroy]

  # GET /magics
  # GET /magics.json
  def index
    @magics = Magic.order(id: :desc)
                   .page(params[:page])
    @obj = TableObject.new(
      name: "Magic",
      pool: @magics,
      attrs: get_attrs
    )
  end

  def new
    @magic = Magic.new
  end

  # GET /magics/1
  # GET /magics/1.json
  def show
    @obj = ShowObject.new(elem: @magic)
  end

  # GET /magics/new
  def new
    @magic = Magic.new
  end

  # GET /magics/1/edit
  def edit
  end

  # POST /magics
  # POST /magics.json
  def create
    @magic = Magic.new(magic_params)
    if @magic.save
      flash[:success] =  'Magic was successfully created.'
      return redirect_to admin_magic_path(@magic)
    else
      render :new
    end
  end

  # PATCH/PUT /magics/1
  # PATCH/PUT /magics/1.json
  def update
    respond_to do |format|
      if @magic.update(magic_params)
        format.html { redirect_to admin_magic_path(@magic), notice: 'Magic was successfully updated.' }
        format.json { render :show, status: :ok, location: @magic }
      else
        format.html { render :edit }
        format.json { render json: @magic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /magics/1
  # DELETE /magics/1.json
  def destroy
    @magic.destroy
    respond_to do |format|
      format.html { redirect_to admin_categories_url, notice: 'Magic was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def search
    magics = Magic.find_by(id: params[:product_search][:name])
    render json: { products: [magics] }
  end

  private

  def get_attrs
    %w[name]
  end
    # Use callbacks to share common setup or constraints between actions.
    def set_magic
      @magic = Magic.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def magic_params
      params.require(:magic).permit(:name)
    end
end
