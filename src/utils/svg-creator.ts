import { JSDOM } from 'jsdom'
import * as d3 from 'd3'
import { Bot } from 'src/modules/bots/schemas/Bot.schema'

class SvgCreator{
    private _body: d3.Selection<HTMLBodyElement | null, unknown, null, undefined>
    private _svg: d3.Selection<SVGSVGElement, unknown, null, undefined>

    
    constructor(){
        const dom = new JSDOM('<!DOCTYPE html><body></body>')
        this._body = d3.select(dom.window.document.querySelector('body'))

        this._svg = this._body.append('svg')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            
    }

    tinyUpvoteShild(votes: number, id: string){
        this._svg.attr('width', 108)
            .attr('height', 20)
            .attr('viewBox', '0 0 108 20')
            .append('defs')
                .append('style')
                    .attr('type', 'text/css')
                    .html('@import url(\'http://fonts.googleapis.com/css?family=Monda\'); * {font-family: \'Monda\', sans-serif;}')

        const a = this._svg.append('a')
            .attr('xlink:href', 'https://zuraaa.com/bots/' + id + '/votar')
            

        const g_text = a.append('g')

        g_text.append('image')
            .attr('x', 43)
            .attr('width', 65)
            .attr('heigth', 20)
            .attr('xlink:href', 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAUCAYAAADStFABAAAAWUlEQVRYhe3QMQ2AQAAEwQUzuKB/FQSXFFSYQA7kczL2RsIsY4wPrwc4VnHAtAOXPWHa9AmTPoEmhD6BJoQ+gSaEPoEmhD6BJoQ+gSaEPoEmhD4BuO0JL3D+XGAGNKvcQWUAAAAASUVORK5CYII=')

        a.append('image')
            .attr('x', 39)
            .attr('width', 16)
            .attr('heigth', 20)
            .attr('xlink:href', 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABnklEQVQ4jZ2Ty5LSQBSGvxOTEA0ZMgmMWuVm2FiljzL6KOLOyxOMuhMfxZlHcTvsuSZcJAjDsRqHqQQGCul1n+//++tueSUvOWQ9EgsX9yKgfFUWHweHOfPrgwCC4IrjRYS/nsnT+plUDSwbMX5tH5JuiYXPkw+xRPUX8hwDWKLfbvX2xjokvYR7XpGTz2dSWw0HBC0LucyYsRcggC02ZfzvMadejRgfnwWL931Nso529wNM9ceULkKpvK1JlVAqWMh1yvCnGe5rshtgqtvYXkDQNMlViQwsmzJr9HRAhz4jxrsBa3GRhPWaxJwQrMSlmt60tcNAE6ZkDwPy4kz1WE5xsFsTJpdtevQYMGbCQhfbgJy4Zl7cnEVjLS7VITP+oOg2ICfuTV7ckNHVWtyE3yx1+W//DnE/NsS962ofU3/EyFzjKn0LcCfuYyThuXkwd+K+Jpq2THqiKVNm9+kFQE7cJ1M9ktB8GCPuS2dDnOZD94ubPyiOTcD/iise+whxBcAx4gqAY8QVAC5O06PkeZRMsqnbaGs3a+8Rd7+Av6YKAXrhWt37AAAAAElFTkSuQmCC')
        
        a.append('image')
            .attr('width', 53)
            .attr('heigth', 8)
            .attr('xlink:href', 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAUCAYAAAAtFnXjAAAAmklEQVRYhe3Uuw2DMBSF4R9GoXBLxRSpGSADZCcGQKxAzwScbSJLsRRF4VHwulecwrK7++nYzkIIJdABBT7yiqgBqJyAkJTlnkDAMy75+XNsF0kNzlB12rhBSWrT3gUqfg7fZ1dvKsU86rclrKP+gbiv38Uy1ZJp1FxMouZa4m7qIllqySRqTUyh1rTEBzXuP86xiagH0LsRAW/9IyEFuh11tAAAAABJRU5ErkJggg==')

        
        a.append('image')
            .attr('x', 4)
            .attr('y', 6)
            .attr('width', 36)
            .attr('heigth', 8)
            .attr('xlink:href', 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAICAYAAACRbl3VAAABKUlEQVQ4jbVU0VHDMBRTcyxQRugKWSEdQB9hBDoCjEBHoCO0HxqAjEBXYIRmBDj15GB6pHxw1Y/j954t+VnOQtIbAJBcI5DUAngHsCG5wxVIegLQ1ev/gwaACTtJq2qfHsD4l5hb4I7kQdIYEdtK0CRG0iuAx4r/meS2jkv6BLAmOVypXwLwjbRV7p7kmPVDk+Cu2rgD4G4dMm+TM9nC1wjgxZuT3GTt4FzEzNZHSBsRi9SMsYzXr4sgk68ipg/BMbllxo+LcYnfMVtvweHa23uZ/0ATdSY/5mR96c4tQPKhPABJp3RuQlN9HyIGF4LOLc011mOJ17Gr9SaXVLxVPHr2kz3kF+97PCNKTy6MNybMmTQ5b7gPsU/vRzJnate4tpja1vj+XQD4AkdSl+Tehc1KAAAAAElFTkSuQmCC')


        g_text.append('text')
            .text(votes)
            .attr('x', '66%')
            .attr('y', '71%')
            .attr('fill', 'white')
            .attr('font-size', '0.7em')
            .attr('text-anchor', 'middle')


        a.append('text')
            .text('👍')
            .attr('x', 90)
            .attr('y', 13)
            .attr('fill', 'white')
            .attr('font-size', '0.7em')

        return this._body.html()
    }

    tinyOwnerShield(owner: string, id: string){
        this._svg.attr('width', 150)
            .attr('height', 20)
            .attr('viewBox', '0 0 150 20')
            .append('defs')
                .append('style')
                    .attr('type', 'text/css')
                    .html('@import url(\'http://fonts.googleapis.com/css?family=Monda\'); * {font-family: \'Monda\', sans-serif;}')

        const a = this._svg.append('a')
            .attr('xlink:href', 'https://zuraaa.com/user/' + id)
        
        const g_text = a.append('g')

        g_text.append('image')
            .attr('x', 39)
            .attr('width', 101)
            .attr('heigth', 22)
            .attr('xlink:href', 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAAAWCAYAAADZylKgAAAAeklEQVRoge3VwQmAQBAEwTkVc7vUjFR9+1EEZbNouK4Qplm29d6/iOJMsk3m4Kkoz+gjgNxJXi+FpV7JZxQgowAZBcgoQEYBMgqQUYCMAmQUIKMAGQXIKEBGATIKkFGAKkobfQSQatEqyjL6EiBr9aggh2EQ5iR7kusHB60LRrffsl0AAAAASUVORK5CYII=')

        g_text.append('image')
            .attr('x', 131)
            .attr('width', 19)
            .attr('heigth', 20)
            .attr('xlink:href', 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAPElEQVQ4jWP09PT8z0A5OMTAwBDPRAWDQMCOgYFhB7UMAwF1ahrGMGrYqGGjho0aNnCG7aGWYdcZGBgSAVBqBjQHBnRbAAAAAElFTkSuQmCC')

        g_text.append('text')
            .attr('x', 100)
            .attr('y', 12.6)
            .attr('fill', 'white')
            .attr('font-size', '0.6em')
            .attr('text-anchor', 'middle')
            .text(owner)

        a.append('image')
            .attr('width', 53)
            .attr('heigth', 20)
            .attr('xlink:href', 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAUCAYAAAAtFnXjAAAAmklEQVRYhe3Uuw2DMBSF4R9GoXBLxRSpGSADZCcGQKxAzwScbSJLsRRF4VHwulecwrK7++nYzkIIJdABBT7yiqgBqJyAkJTlnkDAMy75+XNsF0kNzlB12rhBSWrT3gUqfg7fZ1dvKsU86rclrKP+gbiv38Uy1ZJp1FxMouZa4m7qIllqySRqTUyh1rTEBzXuP86xiagH0LsRAW/9IyEFuh11tAAAAABJRU5ErkJggg==')

        a.append('image')
            .attr('x', 39)
            .attr('width', 16)
            .attr('heigth', 20)
            .attr('xlink:href', 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAABnklEQVQ4jZ2Ty5LSQBSGvxOTEA0ZMgmMWuVm2FiljzL6KOLOyxOMuhMfxZlHcTvsuSZcJAjDsRqHqQQGCul1n+//++tueSUvOWQ9EgsX9yKgfFUWHweHOfPrgwCC4IrjRYS/nsnT+plUDSwbMX5tH5JuiYXPkw+xRPUX8hwDWKLfbvX2xjokvYR7XpGTz2dSWw0HBC0LucyYsRcggC02ZfzvMadejRgfnwWL931Nso529wNM9ceULkKpvK1JlVAqWMh1yvCnGe5rshtgqtvYXkDQNMlViQwsmzJr9HRAhz4jxrsBa3GRhPWaxJwQrMSlmt60tcNAE6ZkDwPy4kz1WE5xsFsTJpdtevQYMGbCQhfbgJy4Zl7cnEVjLS7VITP+oOg2ICfuTV7ckNHVWtyE3yx1+W//DnE/NsS962ofU3/EyFzjKn0LcCfuYyThuXkwd+K+Jpq2THqiKVNm9+kFQE7cJ1M9ktB8GCPuS2dDnOZD94ubPyiOTcD/iise+whxBcAx4gqAY8QVAC5O06PkeZRMsqnbaGs3a+8Rd7+Av6YKAXrhWt37AAAAAElFTkSuQmCC')

        a.append('image')
            .attr('x', 8)
            .attr('y', 5)
            .attr('width', 30)
            .attr('height', 8)
            .attr('xlink:href', 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAICAYAAADuv08kAAAA10lEQVQokbVT2w2DMAy8oC7ACqzQFcoA/ugKrAAjwAqMAB83QFmlWYERWrkyksuzqsRJUR722WcnCSQfAG74RiMiFU5EYqFbEQk6AOQASpLFmYkv8wMRGUgOADLdk9RudABSc6lEpDFhNYDRfKOKFpG4xfF5knlih4mkwXvXjZpk6vxysynuexySGckXyXJR8YaAaOvozhSjVjizbXLMNxxVPP4g6m8sKiZ5BaCjdwI+9+3mI1GrHG01gKfe+ZS4mL1i/U6trfVbdc6uD0WD7CVe5ZigAABvvypcsNKU7K0AAAAASUVORK5CYII=')

        

        return this._body.html()
    }

}

export {
    SvgCreator
}