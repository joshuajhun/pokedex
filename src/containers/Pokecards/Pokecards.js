import React, { Component } from 'react'
import Pokemon from 'pokemon-images'
import { getPokemon, preLoad } from '../../actions'
import { connect } from 'react-redux'
import Card from '../../components/Card/Card'
import { generateUrl, addImage, addPosition } from '../../helpers/helper'
import { fetchPokemon } from '../../helpers/api-utility/api-utility'
import data from '../../data/pokemon.json'
import PreLoadContainer from '../PreLoadContainer/PreLoadContainer'
import './Pokecards.css'

class Pokecards extends Component {
  constructor() {
    super()
    this.generator = generateUrl()
    this.position = addPosition()
    this.state = {
      disable: false,
      loading: true
    }
  }

  componentDidMount = async () => {
    const { value } = this.generator.next()
    fetchPokemon.call(this, this.props.handleFetch, value)
  }

  composeIf(action, truthy){
    if(truthy) {
      action(truthy)
    }
  }

  setStates = (key, value) => this.setState({ [key]: value })

  morePokemon = async () => {
    const { value, done } = this.generator.next()
    this.composeIf(fetchPokemon.bind(this, this.props.handleFetch), value)
    this.composeIf(this.setStates.bind(this, 'disable'), done)
  }

  mappedPokemon = () => {
    return this.props.loaded.map((creature, index) => (
      <Card key={`${creature}-${index}`}
            index={index}
            {...creature}
      /> ))
  }

  shouldLoad = () => this.state.loading ? <img className='loader'
                                               src='./pikachu.gif'/>
                                        : this.mappedPokemon()

  componentWillReceiveProps(nextProps) {
    const { loaded, pokemon } = nextProps
    if(loaded.length === pokemon.length) {
      this.setState({ loading: false })
    }
  }

  render() {
    const { disable } = this.state
    return(
      <section className='pokecards-container'>
        <section className='cards'>
          { this.shouldLoad() }
            <button
              disabled={disable}
              className='moar-pokemon'
              onClick={this.morePokemon}
              > load moar
            </button>
        </section>
          <PreLoadContainer/>
      </section>
    )
  }
}

const mapStateToProps = ({getPokemon, loaded}) => ({
  pokemon: getPokemon,
  loaded
})

const mapDispatchToProps = (dispatch) => ({
  handleFetch: results => dispatch(getPokemon(results)),
  preLoad: pokemon => dispatch(preLoad(pokemon))
})


export default connect(mapStateToProps, mapDispatchToProps)(Pokecards)
